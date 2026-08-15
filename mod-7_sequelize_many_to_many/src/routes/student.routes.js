import { Router } from "express";
import {
    createStudent,
    createStudentProfile,
    getAllStudents,
    getStudentById,
    updateStudentById,
    updateStudentProfile,
    deleteStudent,
    deleteStudentProfile,
    searchAllStudents
} from "../controllers/student.controller.js";


const router = Router();

router.route("/")
                // .get(getAllStudents)
                .post(createStudent)
                .get(searchAllStudents);

router.route("/:id")
                    .get(getStudentById)
                    .patch(updateStudentById)
                    .delete(deleteStudent);

router.route("/:id/profile")
                            .post(createStudentProfile)
                            .patch(updateStudentProfile)
                            .delete(deleteStudentProfile);

export default router;