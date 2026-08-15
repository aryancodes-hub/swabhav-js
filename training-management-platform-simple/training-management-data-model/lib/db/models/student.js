const { Model, DataTypes} = require("sequelize");
class Student extends Model {
    static initModel(sequelize){
        Student.init(
            {
                id:{
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true
                },
                firstName:{
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    validate:{len:[2,50]},
                    set(val){
                        this.setDataValue("firstName", val.trim())
                    }
                },
                lastName:{
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    validate:{len:[2,50]},
                    set(val){
                        this.setDataValue("lastName", val.trim())
                    }
                },
                email:{
                    type: DataTypes.STRING(150),
                    allowNull: false,
                    unique: true,
                    validate:{
                        isEmail: true
                    },
                    set(value){
                        this.setDataValue("email", value.trim().toUpperCase())
                    }
                },
                age:{
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    validate:{ 
                        isInt: true,
                        min: 16,
                        max: 100
                    }
                },
                departmentId:{
                    type: DataTypes.UUID,
                    allowNull: false
                }
            }, 
            {
                sequelize,
                modelName: "Student",
                tableName: "students",
                timestamps: true,
                underscored: true,
                paranoid: true
            }
        );
        return Student;
    }
    static associate(models){
        Student.belongsTo(models.Department, {
            foreignKey: "departmentId",
            as:"department"
        });
    }
}

module.exports = Student;