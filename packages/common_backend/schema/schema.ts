import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import {
    pgEnum,
    pgTable,
    text,
    varchar,
    numeric,
    boolean,
    timestamp,
    jsonb,
    integer
} from "drizzle-orm/pg-core";
import { z } from "zod";

// users table
export const users = pgTable("users", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`).notNull(),
    email: text("email").notNull().unique(),
    image: varchar("image", { length: 255 }).default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// create the insert schema
export const insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true
});

// now export the type of the user
export type users = typeof users.$inferSelect;

// also exporting the type for the input user
export type userInput = z.infer<typeof insertUserSchema>;

// now create the schema for the rooms
export const rooms = pgTable("rooms", {
    id: text("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 200 }).notNull(),
    code: varchar("code").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// now creating the zod schema to validate the field
export const insertRoomSchema = createInsertSchema(rooms).omit({
    id: true,
    createdAt: true
});

// exporting the type of room when it is selected
export type rooms = typeof rooms.$inferSelect;

// now the room participant table
export const roomParticipants = pgTable("room_participants", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    roomId: varchar("room_id").references(() => rooms.id).notNull(),
    userId: varchar("user_id").references(() => users.id).notNull(),
    joinedAt: timestamp("joined_at").defaultNow(),
    isActive: boolean("is_active").default(false)
});

// export the zod validation schema
export const insertRoomParticipant = createInsertSchema(roomParticipants).omit({
    id: true,
    isActive: true
});

// exporting the type of the roomParticipants
export type roomParticipants = typeof roomParticipants.$inferSelect;

// now export the drawing element schema
export const drawingElements = pgTable("drawing_elements", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    roomId: varchar("room_id").references(() => rooms.id, { onDelete: "cascade" }).notNull(),
    userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    type: varchar("type").notNull(),
    data: jsonb("data").notNull(),
    zIndex: integer("z_index").default(0),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});

// now also exporting the drawing elements schema for the zod validation
export const insertDrawingElement = createInsertSchema(drawingElements).omit({
    id: true,
    createdAt: true
});

// now export the type of the elements that are being drawn
export type drawing_elements = typeof drawingElements.$inferSelect;

// type exports for inserts
export type insertRoom = z.infer<typeof insertRoomSchema>;
export type insertRoomParticipant = z.infer<typeof insertRoomParticipant>;
export type insertDrawingElement = z.infer<typeof insertDrawingElement>;

// now create the data schema for the drawing rendering stuffs
export const drawingElementsDataschema = z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    strokeColor: z.string(),
    strokeWidth: z.number(),
    fillColor: z.string().optional(),
    opacity: z.number().default(1),
    points: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
    text: z.string().optional(),
    fontSize: z.number().optional(),
    fontFamily: z.string().optional()
});

// exporting the drawing data validation type for the zod
export type insertDrawingElementData = z.infer<typeof drawingElementsDataschema>;
