import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Courses = sequelize.define(
    "Courses", 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        courseTitle: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique:true,
            field: "course_title",
            validate:{
                len:{
                    args: [2,100],
                    msg: "Course name should be between 2 to 100 characters."
                },
                notEmpty: {
                    msg:"Course name should not be empty"
                }
            }
        },

        courseCredits:{
            type: DataTypes.INTEGER,
            allowNull: false,
            field:"course_credits",
            validate:{
                isInt:{
                    msg:"Course credits should be positive integers."
                },
                min:{
                    args:[1],
                    msg:"minimum 1 grade is neccessary."
                }
            }
        },

        isActive:{
            type: DataTypes.BOOLEAN,
            field:"is_active",
            defaultValue: true
        }
    },
    {
        tableName:"courses",
        timestamps: true,
        underscored: true,
        paranoid: true
    }
)

export default Courses;