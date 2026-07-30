import Student from "./student.model.js";
import StudentProfile from "./studentProfile.model.js";

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

export {
    Student,
    StudentProfile
};