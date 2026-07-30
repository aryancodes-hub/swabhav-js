import { Router } from "express";
import {
  createCourse,
  getAllCourse,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  toggleCourse,
} from "../controllers/course.controller.js";

const courseRouter = Router();

courseRouter.route("/")
                    .get(getAllCourse)
                    .post(createCourse);

courseRouter.route("/:id")
                        .get(getCourseById)
                        .patch(updateCourseById)
                        .delete(deleteCourseById);

courseRouter.route("/toggle/:id")
                                .patch(toggleCourse);
                        

export default courseRouter;