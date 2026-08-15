'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentProfile.belongsTo(models.Student, {foreignKey:"student_id", as:"student"})
    }
  }
  StudentProfile.init({
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
    student_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StudentProfile',
    tableName: 'StudentProfile',
    underscored: true
  });
  return StudentProfile;
};