import express from 'express';
import * as sc from '../controllers/studentController.js';

const router = express.Router();

router.get('/all', sc.getAllStudents);
router.get('/search', sc.getStudentByName)
router.get('/:id', sc.getStudentById);


export default router;

