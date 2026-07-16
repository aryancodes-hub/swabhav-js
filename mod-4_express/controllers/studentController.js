import students from "../data/studentData.js";

// console.log(students);

function getAllStudents(req, res) {
  try {
    res.status(200).json(students);
  } catch (e) {
    console.log("error: ", e);
  }
}

function getStudentById(req, res) {
  const studentID = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentID);
  if (!student) {
    return res.status(404).json({ message: "Student id not in db" });
  }
  res.status(200).json(student);
}

function getStudentByName(req, res) {
  const searchQuery = req.query.name;
  if (!searchQuery) {
    return res.status(400).json({ message: "Please send a name for query" });
  }
  const student = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (student.length === 0) {
    return res
      .status(404)
      .json({ message: `No student with ${searchQuery} name found.` });
  }
  res.status(200).json(student);
}

export { getAllStudents, getStudentByName, getStudentById };
