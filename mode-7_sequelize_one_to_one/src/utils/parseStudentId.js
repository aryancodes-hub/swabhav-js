const parseStudentId = (id) =>{
    const studentId = Number(id);
    if(!Number.isInteger(studentId) || studentId <= 0){
        return null;
    }
    return studentId;
}
export default parseStudentId;