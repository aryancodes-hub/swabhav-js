import Student from "./student.model.js";
import StudentProfile from "./studentProfile.model.js";
import Dept from "./dept.model.js";

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

export {
    Student,
    StudentProfile,
    Dept
};