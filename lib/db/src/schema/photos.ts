import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { usersTable } from "./users";

export const photosTable = pgTable(
  "photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    fortId: text("fort_id").notNull(),
    landmarkId: text("landmark_id"),
    caption: text("caption"),
    imagePath: text("image_path").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    fortIdIdx: index("photos_fort_id_idx").on(t.fortId),
    landmarkIdIdx: index("photos_landmark_id_idx").on(t.landmarkId),
    createdAtIdx: index("photos_created_at_idx").on(t.createdAt),
  }),
);

export const insertPhotoSchema = createInsertSchema(photosTable).omit({ id: true });

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photosTable.$inferSelect;

