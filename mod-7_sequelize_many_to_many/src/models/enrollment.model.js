import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Enrollment = sequelize.define("Enrollment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  enrolletAt: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "enrolled_at",
    defaultValue: DataTypes.NOW
  },

  grade: {
    type: DataTypes.ENUM("o", "a", "b", "c", "d", "e", "f"),
    allowNull: true,
    validate: {
      isIn: {
        args: [["o", "a", "b", "c", "d", "e", "f"]],
        msg: "Grade must be one of the following: o, a, b, c, d, e, f",
      }
    }
  }
},
{
    tableName:"enrollment",
    timestamps: false,
    underscored: true
});

export default Enrollment;
