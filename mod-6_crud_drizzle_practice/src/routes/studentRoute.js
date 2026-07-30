import express from "express";
import {
    getAllStudent,
    getStudentById,
    createStudent,
    updateStudentById,
    deletedStudentById
} from "../controllers/studentController.js";

const router = express.Router();

router.route("/")
                .get(getAllStudent)
                .post(createStudent);

router.route("/:id")
                    .get(getStudentById)
                    .put(updateStudentById)
                    .delete(deletedStudentById);

export default router;