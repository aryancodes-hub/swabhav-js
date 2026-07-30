import { Student, StudentProfile } from "../models/index.js";
import parseStudentId from "../utils/parseStudentId.js";

const handleSequelizeError = (error, res) => {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,

      errors: error.errors.map((validationError) => validationError.message),
    });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "A record with the given unique value already exists",
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
};

export const createStudent = async (req, res) => {
  try {
    
    const { firstName, lastName, email, age } = req.body;
    const student = await Student.create({
      firstName,
      lastName,
      email,
      age,
    });
    return res.status(201).json({
      success: true,
      message: "student created successfully.",
      data: student,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

export const createStudentProfile = async (req,res) => {
    try {
        const studentId = parseStudentId(req.params.id);
        if(!studentId){
          return res.status(400).json({
                success: false,
                message:
                    "Student ID must be a positive integer"
            });
        }
        const student = await Student.findByPk(studentId);
        if(!student){
          return res.status(404).json({
                success: false,
                message:
                    "Student not found"
            });
        }
        const existingProfile = await StudentProfile.findOne({
          where: {
            studentId
          }
        })

        if(existingProfile){
          return res.status(409).json({
                success: false,
                message:
                    "Student already has a profile"
            });
        }
        const {phone, address, dateOfBirth} = req.body;
        const profile = await StudentProfile.create({
          phone,
          address,
          dateOfBirth,
          studentId
        })
        return res.status(201).json({
          success: true,
          data: profile
        })
    } catch (error) {
        return handleSequelizeError(error, res)
    }
};

export const getAllStudents = async (req,res) => {
  try {
    const student = await Student.findAll({
      include:{
        model: StudentProfile,
        as: "profile"
      },
      order:[
        ["id","ASC"]
      ]
    });
    return res.status(200).json({
            success: true,
            count: student.length,
            data: student
        });
  } catch (error) {
    return handleSequelizeError(error,res)
  }
}

export const getStudentById = async (req,res) => {
  try {
    const studentId = parseStudentId(req.params.id);
    if(!studentId){
      return res.status(400).json({
                success: false,
                message:
                    "Student ID must be a positive integer"
            });
    }
    const student = await Student.findByPk(studentId, 
      {
        include:{
          model: StudentProfile,
          as: "profile"
        }
      }
    );
    if(!student){
      return res.status(404).json({
                success: false,
                message:
                    "Student not found"
            });
    };
    return res.status(200).json({
      success:true,
      data: student
    })
  } catch (error) {
    return handleSequelizeError(error, res)
  }
};

export const updateStudentById = async (req,res) => {
  try {
    const studentId = parseStudentId(req.params.id);
    if(!studentId){
      return res.status(400).json({
                success: false,
                message:
                    "Student ID must be a positive integer"
            });
    } 
    const student = await Student.findByPk(studentId);
    if(!student){
      return res.status(404).json({
                success: false,
                message:
                    "Student not found"
            })
    };
    const {firstName, lastName, email, age} = req.body;
    await student.update({
      firstName,
      lastName,
      email,
      age
    });
    return res.status(200).json({
            success: true,
            data: student
        });
  } catch (error) {
    return handleSequelizeError(error,res)
  }
};

export const updateStudentProfile = async (req,res) => {
  try {
    const studentId = parseStudentId(req.params.id);
    if(!studentId){
      return res.status(400).json({
                success: false,
                message:
                    "Student ID must be a positive integer"
            });
    } 
    const profile = await StudentProfile.findOne({
      where:{
        studentId
      }
    });
    if(!profile){
      return res.status(404).json({
                success: false,
                message:
                    "Student Profile not found"
            })
    };
    const {phone, address, dateOfBirth}= req.body;
    await profile.update({
      phone,
      address,
      dateOfBirth,
      studentId
    });
    return res.status(200).json({
      success: true,
      data: profile
    })
  } catch (error) {
    return handleSequelizeError(error,res)
  }
};

export const deleteStudent = async (req,res) => {
  try {
    const studentId = parseStudentId(req.params.id);
    if(!studentId){
      return res.status(400).json({
                success: false,
                message:
                    "Student ID must be a positive integer"
            });
    } 
    const student = await Student.findByPk(studentId);
    if(!student){
      return res.status(404).json({
                success: false,
                message:
                    "Student not found"
            })
    };

    await student.destroy();
    return res.status(200).json({
            success: true,
            message:
                "Student and associated profile deleted successfully",
            data: student
        });
  } catch (error) {
    return handleSequelizeError(error, res)
  }
};

export const deleteStudentProfile = async (req,res) => {
  try {
    const studentId = parseStudentId(req.params.id);
    if(!studentId){
      return res.status(400).json({
                success: false,
                message:
                    "Student ID must be a positive integer"
            });
    } 
    const profile = await StudentProfile.findOne({
      where:{
        studentId
      }
    });
    if(!profile){
      return res.status(404).json({
                success: false,
                message:
                    "Student Profile not found"
            })
    };
    await profile.destroy();
    return res.status(200).json({
            success: true,
            message:"Student profile deleted successfully",
            data: profile
        });
  } catch (error) {
    return handleSequelizeError(error,res)
  }
}
