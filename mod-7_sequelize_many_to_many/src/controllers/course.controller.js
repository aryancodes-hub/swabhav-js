import { Student, Courses } from "../models/index.js";
import handleSequelizeError from "../middleware/handleSequelizeError.js";
import parseIntId from "../utils/parseIntId.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, courseCredits } = req.body;
    const course = await Courses.create({
      courseTitle,
      courseCredits,
    });
    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: course,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

export const getAllCourse = async (req, res) => {
  try {
    const courses = await Courses.findAll({
      where:{
        isActive: true
      }
    });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

export const getCourseById = async (req, res) => {
  try {
    const id = parseIntId(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID must be a positive integer",
      });
    }
    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

export const updateCourseById = async (req, res) => {
  try {
    const id = parseIntId(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID must be a positive integer",
      });
    }
    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }
    const {courseTitle, courseCredits} = req.body
    await course.update({
        courseTitle,
        courseCredits
    });
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

export const deleteCourseById = async (req,res) => {
    try {
        const id = parseIntId(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID must be a positive integer",
      });
    }
    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }
    await course.destroy();
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: course,
    });
    } catch (error) {
        return handleSequelizeError(error,res)
    }
}

export const toggleCourse = async (req,res) => {
  try {
    const id = parseIntId(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID must be a positive integer",
      });
    }
    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }
    course.isActive = !course.isActive;
    await course.save();
    return res.status(200).json({
      success: true,
      message: `Course status updated to ${course.isActive ? 'active' : 'inactive'}`,
      data: course,
    });
  } catch (error) {
    return handleSequelizeError(error,res)
  }
}
