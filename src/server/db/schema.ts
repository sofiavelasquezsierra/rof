import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  pgTable, 
  serial,
  uuid,
} from "drizzle-orm/pg-core";

import { pgTable, serial, integer, varchar, text } from "drizzle-orm/pg-core"; // added this line for scheduler.ts
import { clubs } from "./schema"; // Ensure you import the clubs table if needed; added this line for scheduler.ts


/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `rof_${name}`);


export const students = createTable("student", {
  student_id: varchar("student_id", { length: 255 }).notNull().primaryKey(),
  fname: varchar("fname", { length: 255 }).notNull(),
  lname: varchar("lname", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  role: varchar("role", { length: 255 }).notNull(),
  year: varchar("year", { length: 255 }).notNull(),
});



export const clubs = createTable("club", {
  clubId: varchar("club_id", { length: 255 }).notNull().primaryKey(),
  clubName: varchar("club_name", { length: 255 }).notNull(),
  adminEmail: varchar("admin_email", { length: 255 }).notNull(),
  
});


export const studentClubs = createTable("student_clubs", {
  studentId: varchar("student_id").notNull(),
  clubId: uuid("club_id").notNull(),
},
(table) => ({
  compositePk: primaryKey(table.studentId, table.clubId), // Define composite primary key
})
);


// Define relationships for the `students` table
export const studentsRelations = relations(students, ({ many }) => ({
  studentClubs: many(studentClubs), // Link to the junction table
}));


// Define relationships for the `clubs` table
export const clubsRelations = relations(clubs, ({ many }) => ({
  studentClubs: many(studentClubs), // Link to the junction table
}));


// Define relationships for the `studentClubs` (junction) table
export const studentClubsRelations = relations(studentClubs, ({ one }) => ({
  student: one(students, {
    fields: [studentClubs.studentId], // Foreign key in `studentClubs`
    references: [students.student_id], // Primary key in `students`
  }),
  club: one(clubs, {
    fields: [studentClubs.clubId], // Foreign key in `studentClubs`
    references: [clubs.clubId], // Primary key in `clubs`
  }),
}));

// Events Table - added this for scheduler.ts
export const events = pgTable("events", {
  eventId: serial("event_id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.clubId), // Foreign key referencing clubs
  eventName: varchar("event_name", { length: 255 }).notNull(),
  eventDate: varchar("event_date", { length: 50 }).notNull(), // Use ISO date strings
  description: text("description"),
});