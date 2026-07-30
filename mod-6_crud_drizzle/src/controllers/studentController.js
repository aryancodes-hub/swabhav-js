import * as studentRepository from "../repositories/studentRepository.js";
import {
    parseStudentId, 
    validateStudentData, 
    validateUpdateData
} from "../utils/studentValidation.js";

export const getAllStudents = async (req,res)=>{
    try {
        const studentList = await studentRepository.findAll();
        return res.status(200).json({
        success: true,
        count: studentList.length,
        data: studentList
    });
    } catch (error) {
        console.log(error, error.message);
    };
};

export const getStudentById = async (req,res)=>{
    try {
        const id = parseStudentId(req.params.id);
        const student = await studentRepository.findById(id);
        if(!student){
            const error = new Error(`Student with id ${id} was not found.`);
            error.statusCode = 404;
            throw error;
        };
        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.log(error, error.message);
    }
};

// export const getStudentByEmail = async (req,res)=>{
//     const email = req.query.email;
//     const student = await studentRepository.findByEmail(email);
//     id(!student){
//         const error = new Error(`Student with email:${email} was not found.`);
//         error.statusCode = 404;
//         throw error;
//     };
//     return res.status(200).json({
//         success: true,
//         data: student
//     });
// }

export const createStudent = async(req,res)=>{
    try {
        validateStudentData(req.body);
        const existingStudent = await studentRepository.findByEmail(req.body.email.trim());

        if(existingStudent){
            const error = new Error("Student with email already exists");
            error.statusCode = 409;
            throw error;
        }

        const createdStudent = await studentRepository.create(req.body);

        return res.status(201).json({
            status : "success",
            message : "Student successfully created.",
            data : createStudent
        });
    } catch (error) {
        console.log(error, error.message);
    }
}

export const updateStudent = async (req,res)=>{
    try {
        const studentData = req.body;
        const id = parseStudentId(req.params.id);
        validateUpdateData(studentData);

        const existingStudent = await studentRepository.findById(id);
        if(!existingStudent){
            const error = new Error(`Student with id ${id} does not exists.`);
            error.statusCode(400);
            throw error;
        };

        if(studentData.email !== undefined){
            const normalizedEmail = studentData.email.trim().toLowerCase();
            const existingStudentWithEmail = await studentRepository.findByEmail(normalizedEmail);

            if(existingStudentWithEmail && existingStudentWithEmail.id !== id){
                const error =  new Error("Student with this email already exists.");
                error.statusCode(409);
                throw error
            }
        }
        const updatedStudent = await studentRepository.updateById(id, studentData);
        // const updatedStudent = await studentRepository.updateByIdspread(id, req.body);
        return res.status(200).json({
            status: "Success",
            message: "Student data updated.",
            data : updateStudent
        })
    } catch (error) {
        console.log(error, error.message);
    }
}

export const deleteStudentById = async (req,res) => {
    const id = parseStudentId(req.params.id)
    
    const deletedStudent = await studentRepository.deleteById(id);
    if(!deletedStudent){
        const error = new Error(`Student with id ${id} does not exists.`);
        error.statusCode(404);
        throw error;
    }
    return res.status(200).json({
        status: "Success",
        message: "Student deleted.",
        data : deletedStudent
    })
}