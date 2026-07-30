import { Student, Dept } from "../models/index.js";
import handleSequelizeError from "../middleware/handleSequelizeError.js";
import parseIntId from "../utils/parseIntId.js";

export const createDept = async (req, res) => {
  try {
    const { deptName, deptCode } = req.body;
    // console.log(req.body)
    const dept = await Dept.create({
      deptName,
      deptCode
    });
    return res.status(201).json({
      success: true,
      message: "Dept created successfully.",
      data: dept,
    });
  } catch (error) {
    // console.log(error, error.message)
    return handleSequelizeError(error, res);
  }
};

export const getAllDept = async (req, res) => {
  try {
    const dept = await Dept.findAll();
    return res.status(200).json({
      success: true,
      count: dept.length,
      data: dept,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

export const getDeptById = async (req, res) => {
  try {
    const deptId = parseIntId(req.params.id);
    if (!deptId) {
      return res.status(400).json({
        success: false,
        message: "Department ID must be a positive integer",
      });
    }
    const dept = await Dept.findByPk(deptId,
        {
            include:{
                model:Student,
                as:"students"
            }
        }
    );
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: dept,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

export const updateDeptById = async (req, res) => {
  try {
    const deptId = parseIntId(req.params.id);
    if (!deptId) {
      return res.status(400).json({
        success: false,
        message: "Department ID must be a positive integer",
      });
    }
    const dept = await Dept.findByPk(deptId);
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    const { deptName, deptCode } = req.body;
    await dept.update({
      deptName,
      deptCode,
    });
    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: dept,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

export const deleteDeptById = async (req, res) => {
  try {
    const deptId = parseIntId(req.params.id);
    if (!deptId) {
      return res.status(400).json({
        success: false,
        message: "Department ID must be a positive integer",
      });
    }
    const dept = await Dept.findByPk(deptId);
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    await dept.destroy()
    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      data: dept,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};