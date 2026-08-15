import { Student, StudentProfile } from "../models/index.js";
import parseIntId from "../utils/parseIntId.js";
import handleSequelizeError from "../middleware/handleSequelizeError.js";
import { Op } from "sequelize";


export const createStudent = async (req, res) => {
  try {
    
    const { deptId, firstName, lastName, email, age } = req.body;
    const student = await Student.create({
      deptId,
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
        const studentId = parseIntId(req.params.id);
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
    const students = await Student.findAll({
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
            count: students.length,
            data: students
        });
  } catch (error) {
    return handleSequelizeError(error,res)
  }
}

export const searchAllStudents = async (req,res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page-1)*limit;

    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder || 'ASC';

    const allowedColumns = ['id', 'firstName', 'lastName', 'email', 'createdAt']; 
    const allowedOrders = ['ASC', 'DESC'];

    const finalSortBy = allowedColumns.includes(sortBy) ? sortBy : 'id';
    const finalSortOrder = allowedOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    const {firstName, lastName, email, age, minAge, maxAge} = req.query;
    const whereConditions = {};
    if(firstName){
      whereConditions.firstName = {[Op.iLike]:`%${firstName}%`}
    }
    if(lastName){
      whereConditions.lastName = {[Op.iLike]:`%${lastName}%`}
    }
    if(email){
      whereConditions.email = {[Op.iLike]:`%${email}%`}
    }
    if(age){
      whereConditions.age = parseInt(age)
    }
    if(minAge){
      whereConditions.age = {[Op.gte]: parseInt(age)}
    }
    if(maxAge){
      whereConditions.age = {[Op.lte]: parseInt(age)}
    }

    const {count, rows} = await Student.findAndCountAll({
      where:whereConditions,
      limit: limit,
      offset: offset,
      order:[[finalSortBy,finalSortOrder]]
    })
    
    const totalPages = Math.ceil(count/limit) || 1;
    if(page>totalPages){
      return res.status(400).json({
        success:false,
        message:`Page exceeds the number of total pages. Page should be between 1 to ${totalPages}.`,
        pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit
      }
      })
    }
    return res.status(200).json({
      success:true,
      pagination: {
        totalItems: count,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit
      },
      data: rows
    })
  } catch (error) {
    return handleSequelizeError(error,res)
  }
}

export const getStudentById = async (req,res) => {
  try {
    const studentId = parseIntId(req.params.id);
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
    const studentId = parseIntId(req.params.id);
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
    const {deptId, firstName, lastName, email, age} = req.body;
    await student.update({
      deptId,
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
    const studentId = parseIntId(req.params.id);
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
    const studentId = parseIntId(req.params.id);
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
    const studentId = parseIntId(req.params.id);
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
