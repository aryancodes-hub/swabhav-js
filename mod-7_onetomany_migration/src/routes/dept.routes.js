const { Router } = require( "express");
const {
    createDept,
    getAllDept,
    getDeptById,
    updateDeptById,
    deleteDeptById
} = require( "../controllers/dept.controller.js");

const deptRouter = Router();

deptRouter.route("/")
                    .get(getAllDept)
                    .post(createDept);
                    
deptRouter.route("/:id")
                        .get(getDeptById)
                        .patch(updateDeptById)
                        .delete(deleteDeptById);

module.exports = deptRouter;