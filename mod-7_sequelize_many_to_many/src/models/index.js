import Student from "./student.model.js";
import StudentProfile from "./studentProfile.model.js";
import Dept from "./dept.model.js";
import Enrollment from "./enrollment.model.js";
import Courses from "./courses.model.js";

Student.hasOne(
    StudentProfile,
    {
        foreignKey: {
            name: "studentId",
            field: "student_id",
            allowNull: false
        },
        
        as: "profile",
        onDelete: "CASCADE",
        onUpdate:"CASCADE"
    }
);

StudentProfile.belongsTo(
    Student,
    {
        foreignKey:{
            name: "studentId",
            field: "student_id",
            allowNull: false
        },
        as: "student",
        onUpdate:"CASCADE"
    }
);


Dept.hasMany(Student,
    {
        foreignKey:{
            name: "deptId",
            field:"dept_id",
            allowNull: true
        },
        as: "students"
    }
);

Student.belongsTo(Dept,
    {
        foreignKey:{
            name:"deptId",
            field:"dept_id",
            allowNull: true
        },
        as:"department"
    }
);

Student.belongsToMany(Courses, {
    through: Enrollment,
    foreignKey:"studentId",
    otherKey:"courseId",
    as: "courses"
});

Courses.belongsToMany(Student, {
    through: Enrollment,
    foreignKey: "courseId",
    otherKey:"studentId",
    as:"students"
});



export {
    Student,
    StudentProfile,
    Dept,
    Courses,
    Enrollment
};