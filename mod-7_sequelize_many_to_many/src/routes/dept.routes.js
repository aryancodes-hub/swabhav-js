import { Router } from "express";
import {
    createDept,
    getAllDept,
    getDeptById,
    updateDeptById,
    deleteDeptById
} from "../controllers/dept.controller.js";

const deptRouter = Router();

deptRouter.route("/")
                    .get(getAllDept)
                    .post(createDept);
                    
deptRouter.route("/:id")
                        .get(getDeptById)
                        .patch(updateDeptById)
                        .delete(deleteDeptById);

export default deptRouter;