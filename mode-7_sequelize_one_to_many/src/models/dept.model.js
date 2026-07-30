import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Dept = sequelize.define(
    "Dept", 
    {
        deptId:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            field:"dept_id",
            primaryKey: true
        },
        deptName:{
            type: DataTypes.STRING(50),
            allowNull: false,
            unique:true,
            field: "dept_name",
            validate:{
                notEmpty: {
                    msg:"department name should not be empty"
                },
                len:{
                    args:[2,50],
                    msg:"department name must contain between 2 and 50 characters"
                }
            }
        },

        deptCode:{
            type: DataTypes.STRING(10),
            allowNull:false,
            unique:true,
            field:"dept_code",
            validate:{
                notEmpty: {
                    msg:"department code should not be empty"
                },
                len:{
                    args:[2,10],
                    msg:"Department code must contain between 2 and 10 characters"
                }
            }
        }
    },
    {
        tableName:"dept",
        timestamps: true,
        underscored: true
    }
);

export default Dept;