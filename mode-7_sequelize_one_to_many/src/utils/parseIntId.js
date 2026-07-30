const parseIntId = (id) =>{
    const IntId = Number(id);
    if(!Number.isInteger(IntId) || IntId <= 0){
        return null;
    }
    return IntId;
}
export default parseIntId;