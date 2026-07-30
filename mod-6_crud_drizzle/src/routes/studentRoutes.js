import express from "express";
import * as studentController from "../controllers/studentController.js";
import { notFoundHandler } from "../middleware/notFoundHandler.js";


const router = express.Router();

router.route("/")
    .get(studentController.getAllStudents)
    .post(studentController.createStudent);

router.route("/:id")
    .get(studentController.getStudentById)
    .put(studentController.updateStudent)
    .delete(studentController.deleteStudentById);

export default router;