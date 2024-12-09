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
} from "drizzle-orm/pg-core";


/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `rof_${name}`);


export const students = createTable("student", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fname: varchar("fname", { length: 255 }).notNull(),
  lname: varchar("lname", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});



export const clubs = createTable("club", {
  clubId: varchar("club_id", { length: 255 }).notNull().primaryKey(),
  clubName: varchar("club_name", { length: 255 }).notNull(),
});


export const studentClubs = createTable("student_clubs", {
  studentId: varchar("id").notNull(),
  clubId: varchar("club_id").notNull(),
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
    references: [students.id], // Primary key in `students`
  }),
  club: one(clubs, {
    fields: [studentClubs.clubId], // Foreign key in `studentClubs`
    references: [clubs.clubId], // Primary key in `clubs`
  }),
}));