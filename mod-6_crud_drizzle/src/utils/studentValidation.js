export const parseStudentId = (idValue) =>{
    const id = Number(idValue);

    if(!Number.parseInt(id) || id <=0){
        const error = new Error("Student Id must be positive integer value");

        error.statuscode = 400;
        throw error;
    }

    return id;
}

export const validateStudentData = (data)=>{
    if(!data.firstName || !data.lastName || !data.email || data.age==undefined){
        const error = new Error("First Name, Last Name, Email and Age are required");
        error.statuscode = 400;
        throw error;
    }
}

export const validateUpdateData =(data)=>{
    if(Object.keys(data).length === 0){
        const error = new Error("Update Operation should pass atleast one field");
        error.statuscode = 400;
        throw error;
    }
}