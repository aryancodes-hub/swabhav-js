import fs from "node:fs";
import path from "node:path";

const filepath = path.resolve("data", "studentData.json");
// console.log(filepath)
const fileData = fs.readFileSync(filepath, "utf-8");
const students = JSON.parse(fileData);

const getAllStudents = (req, res) => {
  const { firstName, lastName, age, grade, subjects } = req.query;
  let filteredStudents = students;
  if (firstName) {
    filteredStudents = filteredStudents.filter(s=> s.name.toLowerCase().includes(firstName.toLowerCase()))
  }
  if (lastName) {
    filteredStudents = filteredStudents.filter(s=> s.name.toLowerCase().includes(lastName.toLowerCase()))
  }
  if (age) {
    let ageNum = parseInt(age);
    filteredStudents = filteredStudents.filter(s=> s.age === ageNum)
  }
  if(grade){
    filteredStudents = filteredStudents.filter(s => s.grade === grade)
  }
  if(subjects){
    filteredStudents = filteredStudents.filter(s => s.subjects && s.subjects.some(sub=> sub.toLowerCase().includes(subjects.toLowerCase())))
  }

  if(filteredStudents.length === 0){
    return res.status(404).json({message: 'Student not found, enter valid details'})
  }
  res.status(200).json(filteredStudents)

};

const getStudentById = (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return res
      .status(404)
      .json({ message: `Student not found for id ${studentId}` });
  }
  res.status(200).json(student);
};

const addStudent =async (req, res) =>{
    const {name, age, grade, subjects} = req.body;
    if(!age || !name || !grade || !subjects){
        return res.status(400).json({message: 'Missing data. Please send name, age, grade and subjects'})
    }
    try{
        const newId = students.length>0?students[students.length-1].id+1:1;
        const newStudent = {
                id: newId,
                name,
                age,
                grade,
                subjects
        };
        students.push(newStudent);
        await fs.promises.writeFile(filepath, JSON.stringify(students, null, 2));
        res.status(201).json({
            message: "Student successfully created",
            student: newStudent
        });
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
};

export default {getAllStudents, getStudentById, addStudent};