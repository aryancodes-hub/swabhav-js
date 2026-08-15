const { Router } = require("express");
const {
    createStudent,
    createStudentProfile,
    getAllStudents,
    getStudentById,
    updateStudentById,
    updateStudentProfile,
    deleteStudent,
    deleteStudentProfile
} = require("../controllers/student.controller.js");


const router = Router();

router.route("/")
                .get(getAllStudents)
                .post(createStudent);

router.route("/:id")
                    .get(getStudentById)
                    .patch(updateStudentById)
                    .delete(deleteStudent);

router.route("/:id/profile")
                            .post(createStudentProfile)
                            .patch(updateStudentProfile)
                            .delete(deleteStudentProfile);

module.exports = router;