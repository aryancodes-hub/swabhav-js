import 
{
    pgTable,
    integer,
    varchar,
    timestamp,
    serial,
    text
} from "drizzle-orm/pg-core";

import { relations  } from "drizzle-orm";
import { time } from "drizzle-orm/mysql-core";

export const students = pgTable(
    "students",{
        id:serial("id")
            .primaryKey(),
        
            firstName:varchar(
                "first_name",
                {length: 100}
            ).notNull(),

            lastName:varchar(
                "last_name",
                {length: 100}
            ).notNull(),

            email:varchar(
                "email",
                {length: 255}
            ).unique().notNull(),

            age: integer("age").notNull(),

            createdAt: timestamp(
                "created_at",
                {withTimezone: true}
            ).defaultNow().notNull(),

            updatedAt: timestamp(
                "updated_at",
                {withTimezone: true}
            ).defaultNow().notNull()
    }
)

export const studentProfile = pgTable(
    "student_profile",{
        profileId:serial("profile_id")
                                    .primaryKey(),
        
        address:text("address")
                            .notNull(),
        
        phone:varchar(
            "phone",
            {length: 10}
        ),

        studentId:integer("student_id").references(()=> students.id, {onDelete:'cascade'}).notNull().unique(),

        createdAt:timestamp(
            "created_at",
            {withTimezone: true}
        ).defaultNow().notNull(),

        updatedAt:timestamp(
            "updated_at",
            {withTimezone: true}
        ).defaultNow().notNull()
    }
)


export const studentRelations = relations(students, ({ one }) => ({
  profile: one(studentProfile),
}));

export const studentProfileRelations = relations(studentProfile, ({ one })=>{
    student: one(students, {
        fields:[studentProfile.studentId],
        references:[students.id]
    })
})