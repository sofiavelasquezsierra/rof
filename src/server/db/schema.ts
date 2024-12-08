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
//import { type Adapterclub } from "next-auth/adapters";


/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `rof_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => students.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const students = createTable("student", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()).notNull(),
  fname: varchar("fname", { length: 255 }).notNull(),
  lname: varchar("lname", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  //image: varchar("image", { length: 255 }),
});


export const clubs = createTable(
  "club",
  {
    clubId: varchar("club_id", { length: 255 })
      .notNull()
      .primaryKey()
      .references(() => students.id),
    clubName: varchar("club_name", { length: 255 }).notNull(),
  
    
  }
);

export const studentClubs = pgTable("student_clubs", {
  studentId: integer("id").notNull(),
  clubId: integer("club_id").notNull(),
});


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
