import express from "express";
import studentController from '../controllers/studentControllers.js';

const router = express.Router();

router.get('/', studentController.getAllStudents);

router.get('/:id', studentController.getStudentById);
router.post('/add', studentController.addStudent);
export default router;