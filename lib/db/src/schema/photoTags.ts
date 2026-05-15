import { index, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { photosTable } from "./photos";

export const photoTagsTable = pgTable(
  "photo_tags",
  {
    photoId: uuid("photo_id")
      .notNull()
      .references(() => photosTable.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.photoId, t.tag] }),
    tagIdx: index("photo_tags_tag_idx").on(t.tag),
  }),
);

export const insertPhotoTagSchema = createInsertSchema(photoTagsTable);

export type InsertPhotoTag = z.infer<typeof insertPhotoTagSchema>;
export type PhotoTag = typeof photoTagsTable.$inferSelect;

