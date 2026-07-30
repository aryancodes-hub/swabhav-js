import { Router } from "express";
import { enrollStudent, getAllEnrolled, updateGrade } from "../controllers/enrollment.controller.js";

const enrollRouter = Router();

enrollRouter.route("/")
                    .post(enrollStudent)
                    .get(getAllEnrolled)
                    .patch(updateGrade);

export default enrollRouter;
