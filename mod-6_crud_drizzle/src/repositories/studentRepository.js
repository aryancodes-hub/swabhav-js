import { asc, eq } from "drizzle-orm";
import { db } from "../cofig/database.js";
import { students, studentProfile } from "../db/schema.js";

// find all students

export const findAll = async () => {
  const studentList = await db.select().from(students).orderBy(asc(students.id));
  return studentList;
};

// find student by id

export const findById = async(id) =>{
    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
    const [student] = result;
    return student;
};

// find student by email

export const findByEmail = async (email) =>{
    const result = await db.select().from(students).where(eq(students.email, email)).limit(1);

    const [ student ]= result;
    return student;
};

// create student a post request

export const create = async (studentData) =>{
    const result = await db.insert(students).values({
                                    firstName:studentData.firstName.trim(),
                                    lastName:studentData.lastName.trim(),
                                    email:studentData.email.trim().toLowerCase(),
                                    age: Number(studentData.age)
                                            }).returning();
    const [createdStudent] = result;
    return createdStudent
}


export const updateById = async (id, studentData) =>{
    const updatedValues = {};

    if(studentData.firstName !== undefined){
        updatedValues.firstName = studentData.firstName.trim();
    }
    if(studentData.lastName){
        updatedValues.lastName = studentData.lastName.trim();
    }
    if(studentData.email){
        updatedValues.email = studentData.email.trim().toLowerCase();
    }
    if(studentData.age!==undefined){
        updatedValues.age = Number(studentData.age);
    }

    updatedValues.updateAt = new Date();

    const result = await db.update(students).set(updatedValues).where(eq(students.id, id)).returning();
    const [updatedStudent] = result;
    return updatedStudent;
}

// using spread operator above
export const updateByIdspread = async(id, studentData)=>{
    const updatedValues = {...studentData};
    updatedValues.updateAt = new Date();
    const result = await db.update(students).set(updatedValues).where(eq(students.id, id)).returning();
    const [updatedStudent] = result;
    return updatedStudent;
}

// delete by id

export const deleteById = async(id) =>{
    const result = await db.delete(students).where(eq(students.id, id)).returning();

    const [deletedStudent] = result;
    return deletedStudent;
}

