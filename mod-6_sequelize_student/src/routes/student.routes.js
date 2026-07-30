import { Router } from "express";
import { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } from "../controllers/student.controller.js";

const router = Router();
router.route("/")
                .get(getAllStudents)
                .post(createStudent);
router.route("/:id")
                    .get(getStudentById)
                    .patch(updateStudent)
                    .delete(deleteStudent);


export default router