import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Student = sequelize.define(
    "Student", 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        firstName:{
            type: DataTypes.STRING(50),
            allowNull: false,
            field:"first_name",
            validate: {
                notEmpty: {
                    msg:"Firstname cannot be empty."
                },
                len:{
                    args: [2,50],
                    msg:"Firstname should atleast have 2 to 50 characters."
                }
            }
        },

        lastName:{
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "last_name",
            validate:{
                notEmpty:{
                    msg:"Last name cannot be empty."
                },
                len:{
                    args:[2,50],
                    msg:"Last name should atleast have 2 to 50 characters."
                }
            }
        },

        email:{
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,

            validate:{
                isEmail:{
                    msg:"enter a valid email address"
                }
            }
        },

        age:{
            type: DataTypes.INTEGER,
            allowNull: false,

            validate:{
                isInt:{
                    msg:"Age must be an integer."
                },
                min:{
                    args:[1],
                    msg:"Minimum age should at the least be 1"
                },
                max:{
                    args:[120],
                    msg:"Maximum age cannot exceed 120"
                }
            }
        }


    },
    {
        tableName:"students",
        timestamps: true,
        underscored: true
    }
)

export default Student;