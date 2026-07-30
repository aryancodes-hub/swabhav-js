import { students } from "../db/schema.js";
import { db } from "../config/database.js";
import { asc,eq } from "drizzle-orm";

// get all students

export const findAll = async () => {
    const studentList = await db.select().from(students).orderBy(asc(students.id));
    return studentList;
}

// get student by id

export const findById = async (id) => {
    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
    const [student] = result;
    return student;
}

// get student by email

export const findByEmail = async (email) => {
    const result = await db.select().from(students).where(eq(students.email, email)).limit(1);
    const [student] = result;
    return student;
}

// add or create student

export const create = async (studentData) => {
    const result = await db.insert(students).values({
        firstName: studentData.firstName.trim(),
        lastName: studentData.lastName.trim(),
        email: studentData.email.trim().toLowerCase(),
        age: Number(studentData.age)
    }).returning();
    const [createdStudent]  = result;
    return createdStudent
}

// update student data

export const updateById = async (id,studentData) => {
    const updatedValues = {...studentData};
    updatedValues.updatedAt = new Date();
    const result = await db.update(students).set(updatedValues).where(eq(students.id, id)).returning();
    const [updatedStudent] = result;
    return updatedStudent
}

// delete student by id

export const deleteById = async (id) => {
    const result = await db.delete(students).where(eq(students.id, id)).returning();
    const [deletedStudent] = result;
    return deletedStudent
}