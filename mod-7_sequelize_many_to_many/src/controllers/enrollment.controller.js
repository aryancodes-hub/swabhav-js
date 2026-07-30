import { Student, Courses, Enrollment } from "../models/index.js";
import handleSequelizeError from "../middleware/handleSequelizeError.js";

export const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Student Id and Course Id both must be provided.",
      });
    }
    const student = await Student.findByPk(studentId);
    if (!student) {
        return res.status(404).json({
        success: false,
        message: "Student not found",
      })
    }
    const course = await Courses.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }
    if(!course.isActive){
        return res.status(400).json({
            success:false,
            message:"Course not available."
        })
    }
    await student.addCourse(course);
    return res.status(200).json({
        success: true,
        message: "Successfully enrolled student into course "
    })
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

export const getAllEnrolled = async (req,res) => {
    try {
        const enrolled = await Enrollment.findAll();
        return res.status(200).json({
            success:true,
            count: enrolled.length,
            data: enrolled
        })
    } catch (error) {
        return handleSequelizeError(error,res)
    }
}

export const updateGrade = async (req,res) => {
    try {
        const {studentId, courseId, grade} =  req.body;
        const enrollment = await Enrollment.findOne({
            where:{
                studentId,
                courseId
            }
        })
        if(!enrollment){
            return res.status(404).json({
                success: false,
                message:"Enrollment record not found"
            })
        }
        await enrollment.update({grade});
        return res.status(200).json({
            success:true,
            message:`Grade entered ${grade}`
        })
    } catch (error) {
        return handleSequelizeError(error,res)
    }
}
