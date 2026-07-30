import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const StudentProfile = sequelize.define(
    "StudentProfile", 
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        phone:{
            type: DataTypes.STRING(15),
            allowNull: false,
            validate:{
                notEmpty:{
                    msg:"phone number cannot be empty"
                },
                len:{
                    args:[10,15],
                    msg:"Phone number must contain between 10 and 15 characters"
                }
            }
        },

        address:{
            type: DataTypes.STRING(255),
            allowNull: true
        },

        dateOfBirth:{
            type: DataTypes.DATEONLY,
            allowNull: true,
            field:"date_of_birth",
            validate:{
                isDate:{
                    msg:"Date of birth must be a valid date"
                }
            }
        },

        studentId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            unique:true,
            field: "student_id"
        }
    },
    {
        tableName:"studentProfile",
        timestamps: true,
        underscored: true
    }
);

export default StudentProfile;