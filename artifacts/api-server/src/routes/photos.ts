import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Router, type IRouter } from "express";
import multer from "multer";
import { and, desc, eq, lt, or, sql } from "drizzle-orm";

import {
  DeletePhotoParams,
  DeletePhotoResponse,
  GetPhotoParams,
  GetPhotoResponse,
  ListFortPhotosParams,
  ListFortPhotosQueryParams,
  ListFortPhotosResponse,
  CreateFortPhotoParams,
  CreateFortPhotoResponse,
} from "@workspace/api-zod";
import { db, photoTagsTable, photosTable } from "@workspace/db";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth";

const router: IRouter = Router();

const uploadsDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).slice(0, 10) || ".jpg";
    const id = crypto.randomUUID();
    cb(null, `${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

function normalizeTags(tags: string | undefined): string[] {
  if (!tags) return [];
  const parts = tags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set(parts)).slice(0, 20);
}

type Cursor = { createdAt: string; id: string };

function encodeCursor(cursor: Cursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf-8").toString("base64url");
}

function decodeCursor(raw: string | undefined): Cursor | null {
  if (!raw) return null;
  try {
    const decoded = Buffer.from(raw, "base64url").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.createdAt === "string" &&
      typeof parsed.id === "string"
    ) {
      return { createdAt: parsed.createdAt, id: parsed.id };
    }
    return null;
  } catch {
    return null;
  }
}

function toImageUrl(imagePath: string): string {
  // `imagePath` is stored as `/uploads/<file>`
  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}

router.get("/forts/:fortId/photos", async (req, res) => {
  const params = ListFortPhotosParams.parse(req.params);
  const query = ListFortPhotosQueryParams.parse(req.query);
  const cursor = decodeCursor(query.cursor);

  const tag = query.tag?.trim().toLowerCase();
  const landmarkId = query.landmarkId?.trim();

  const baseWhere = and(
    eq(photosTable.fortId, params.fortId),
    landmarkId ? eq(photosTable.landmarkId, landmarkId) : undefined,
    cursor
      ? or(
          lt(photosTable.createdAt, new Date(cursor.createdAt)),
          and(
            eq(photosTable.createdAt, new Date(cursor.createdAt)),
            lt(photosTable.id, cursor.id),
          ),
        )
      : undefined,
  );

  // When filtering by tag, join against photo_tags.
  const rows = tag
    ? await db
        .select({
          id: photosTable.id,
          fortId: photosTable.fortId,
          landmarkId: photosTable.landmarkId,
          caption: photosTable.caption,
          imagePath: photosTable.imagePath,
          userId: photosTable.userId,
          createdAt: photosTable.createdAt,
          tags: sql<string[]>`array_agg(distinct ${photoTagsTable.tag})`.as("tags"),
        })
        .from(photosTable)
        .innerJoin(photoTagsTable, eq(photoTagsTable.photoId, photosTable.id))
        .where(and(baseWhere, eq(photoTagsTable.tag, tag)))
        .groupBy(photosTable.id)
        .orderBy(desc(photosTable.createdAt), desc(photosTable.id))
        .limit(query.limit)
    : await db
        .select({
          id: photosTable.id,
          fortId: photosTable.fortId,
          landmarkId: photosTable.landmarkId,
          caption: photosTable.caption,
          imagePath: photosTable.imagePath,
          userId: photosTable.userId,
          createdAt: photosTable.createdAt,
          tags: sql<string[]>`coalesce(array_agg(distinct ${photoTagsTable.tag}) filter (where ${photoTagsTable.tag} is not null), '{}')`.as(
            "tags",
          ),
        })
        .from(photosTable)
        .leftJoin(photoTagsTable, eq(photoTagsTable.photoId, photosTable.id))
        .where(baseWhere)
        .groupBy(photosTable.id)
        .orderBy(desc(photosTable.createdAt), desc(photosTable.id))
        .limit(query.limit);

  const items = rows.map((r) => ({
    id: r.id,
    fortId: r.fortId,
    landmarkId: r.landmarkId ?? null,
    caption: r.caption ?? null,
    tags: (r.tags ?? []).filter(Boolean),
    imageUrl: toImageUrl(r.imagePath),
    userId: r.userId,
    createdAt: r.createdAt,
  }));

  const nextCursor =
    items.length === query.limit
      ? encodeCursor({
          createdAt: items[items.length - 1].createdAt.toISOString(),
          id: items[items.length - 1].id,
        })
      : null;

  const data = ListFortPhotosResponse.parse({ items, nextCursor });
  res.json(data);
});

router.post(
  "/forts/:fortId/photos",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    const params = CreateFortPhotoParams.parse(req.params);
    const userId = (req as AuthedRequest).userId;

    if (!req.file) {
      res.status(400).json({ message: "Missing image file" });
      return;
    }

    const landmarkId =
      typeof req.body.landmarkId === "string" && req.body.landmarkId.trim() !== ""
        ? req.body.landmarkId.trim()
        : null;
    const caption =
      typeof req.body.caption === "string" && req.body.caption.trim() !== ""
        ? req.body.caption.trim()
        : null;
    const tags = normalizeTags(typeof req.body.tags === "string" ? req.body.tags : undefined);

    const imagePath = `/uploads/${req.file.filename}`;

    const inserted = (
      await db
        .insert(photosTable)
        .values({
          userId,
          fortId: params.fortId,
          landmarkId,
          caption,
          imagePath,
        })
        .returning()
    )[0];

    if (tags.length > 0) {
      await db
        .insert(photoTagsTable)
        .values(tags.map((tag) => ({ photoId: inserted.id, tag })));
    }

    const response = CreateFortPhotoResponse.parse({
      id: inserted.id,
      fortId: inserted.fortId,
      landmarkId: inserted.landmarkId ?? null,
      caption: inserted.caption ?? null,
      tags,
      imageUrl: toImageUrl(inserted.imagePath),
      userId: inserted.userId,
      createdAt: inserted.createdAt,
    });

    res.json(response);
  },
);

router.get("/photos/:photoId", async (req, res) => {
  const params = GetPhotoParams.parse(req.params);
  const rows = await db
    .select({
      id: photosTable.id,
      fortId: photosTable.fortId,
      landmarkId: photosTable.landmarkId,
      caption: photosTable.caption,
      imagePath: photosTable.imagePath,
      userId: photosTable.userId,
      createdAt: photosTable.createdAt,
      tags: sql<string[]>`coalesce(array_agg(distinct ${photoTagsTable.tag}) filter (where ${photoTagsTable.tag} is not null), '{}')`.as(
        "tags",
      ),
    })
    .from(photosTable)
    .leftJoin(photoTagsTable, eq(photoTagsTable.photoId, photosTable.id))
    .where(eq(photosTable.id, params.photoId))
    .groupBy(photosTable.id)
    .limit(1);

  const row = rows[0];
  if (!row) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  const data = GetPhotoResponse.parse({
    id: row.id,
    fortId: row.fortId,
    landmarkId: row.landmarkId ?? null,
    caption: row.caption ?? null,
    tags: (row.tags ?? []).filter(Boolean),
    imageUrl: toImageUrl(row.imagePath),
    userId: row.userId,
    createdAt: row.createdAt,
  });
  res.json(data);
});

router.delete("/photos/:photoId", requireAuth, async (req, res) => {
  const params = DeletePhotoParams.parse(req.params);
  const userId = (req as AuthedRequest).userId;

  const existing = await db
    .select()
    .from(photosTable)
    .where(eq(photosTable.id, params.photoId))
    .limit(1);

  const photo = existing[0];
  if (!photo) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  if (photo.userId !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  await db.delete(photosTable).where(eq(photosTable.id, photo.id));

  // Best-effort file cleanup (ignore errors).
  if (photo.imagePath.startsWith("/uploads/")) {
    const filePath = path.join(uploadsDir, path.basename(photo.imagePath));
    fs.rm(filePath, { force: true }, () => {});
  }

  const data = DeletePhotoResponse.parse({ ok: true });
  res.json(data);
});

export default router;

