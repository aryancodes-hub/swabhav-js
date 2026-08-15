const { Student, dept } = require("../models/index.js");
const handleSequelizeError = require("../middleware/handleSequelizeError.js");
const parseIntId = require("../utils/parseIntId.js");

const createDept = async (req, res) => {
  try {
    const { name, code } = req.body;
    console.log(req.body)
    const department = await dept.create({
      name,
      code
    });
    return res.status(201).json({
      success: true,
      message: "dept created successfully.",
      data: department,
    });
  } catch (error) {
    // console.log(error, error.message)
    return handleSequelizeError(error, res);
  }
};

const getAllDept = async (req, res) => {
  try {
    const department = await dept.findAll();
    return res.status(200).json({
      success: true,
      count: department.length,
      data: department,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

const getDeptById = async (req, res) => {
  try {
    const deptId = parseIntId(req.params.id);
    if (!deptId) {
      return res.status(400).json({
        success: false,
        message: "Department ID must be a positive integer",
      });
    }
    const department = await dept.findByPk(deptId,
        {
            include:{
                model:Student,
                as:"students"
            }
        }
    );
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

const updateDeptById = async (req, res) => {
  try {
    const deptId = parseIntId(req.params.id);
    if (!deptId) {
      return res.status(400).json({
        success: false,
        message: "Department ID must be a positive integer",
      });
    }
    const department = await dept.findByPk(deptId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    const { name, code } = req.body;
    await department.update({
      name,
      code,
    });
    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

const deleteDeptById = async (req, res) => {
  try {
    const deptId = parseIntId(req.params.id);
    if (!deptId) {
      return res.status(400).json({
        success: false,
        message: "Department ID must be a positive integer",
      });
    }
    const department = await dept.findByPk(deptId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    await department.destroy()
    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      data: department,
    });
  } catch (error) {
    return handleSequelizeError(error, res);
  }
};

module.exports = {
  createDept,
  getAllDept,
  getDeptById,
  updateDeptById,
  deleteDeptById
}