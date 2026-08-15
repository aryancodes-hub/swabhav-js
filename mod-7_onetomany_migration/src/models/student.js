'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.dept, {foreignKey:'deptId', as:'department'});
      Student.hasOne(models.StudentProfile, {foreignKey:'student_id', as:'profile'})
    }
  }
  Student.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER,
    deptId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Student',
    tableName:'student',
    underscored: true
  });
  return Student;
};