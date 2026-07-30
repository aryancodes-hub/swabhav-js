import * as studentRepository from "../repositories/studentRepository.js";
import * as studentValidation from "../utils/studentValidation.js";

export const getAllStudent = async (req, res) => {
  try {
    const studentList = await studentRepository.findAll();
    return res.status(200).json({
      success: true,
      count: studentList.length,
      data: studentList,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getStudentById = async (req, res) => {
  try {
    const id = studentValidation.parseStudentId(req.params.id);
    const student = await studentRepository.findById(id);
    if (!student) {
      const error = new Error(`Student with id ${id} is not found.`);
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// export const getStudentByEmail

export const createStudent = async (req, res) => {
  try {
    studentValidation.validateStudentData(req.body);
    const existingStudent = await studentRepository.findByEmail(
      req.body.email.trim(),
    );
    if (existingStudent) {
      const error = new Error("Student with email already exists");
      error.statusCode = 409;
      throw error;
    }
    const createdStudent = await studentRepository.create(req.body);
    return res.status(201).json({
      status: "success",
      message: "Student successfully created.",
      data: createStudent,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateStudentById = async (req, res) => {
  try {
    const studentData = req.body;
    const id = studentValidation.parseStudentId(req.params.id);
    studentValidation.validateUpdateData(studentData);
    const existingStudent = await studentRepository.findById(id);
    if (!existingStudent) {
      const error = new Error(`Student with id ${id} does not exists.`);
      error.statusCode = 400;
      throw error;
    }
    if (studentData.email !== undefined) {
      const normalizedEmail = studentData.email.trim().toLowerCase();
      const existingStudentWithEmail =
        await studentRepository.findByEmail(normalizedEmail);
      if (existingStudentWithEmail && existingStudentWithEmail.id !== id) {
        const error = new Error("Student with this email already exists");
        error.statusCode = 409;
        throw error;
      }
    }
    const updatedStudent = await studentRepository.updateById(id, studentData);
    return res.status(200).json({
      status: "Success",
      message: "Student data updated.",
      data: updatedStudent,
    });
  } catch (error) {
    console.log(error, error.message);
  }
};

export const deletedStudentById = async (req, res) => {
  try {
    const id = studentValidation.parseStudentId(req.params.id);
    const deletedStudent = await studentRepository.deleteById(id);
    if (!deletedStudent) {
      const error = new Error(`Student with id ${id} does not exists.`);
      error.statusCode(404);
      throw error;
    }
    return res.status(200).json({
      status: "Success",
      message: "Student deleted.",
      data: deletedStudent,
    });
  } catch (error) {
    console.log(error.message);
  }
};
