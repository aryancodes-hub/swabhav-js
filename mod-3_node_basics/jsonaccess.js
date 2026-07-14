import fs from 'node:fs/promises';


let filepath = "jsonaccess.json"

async function readjson(path){
    const data = await fs.readFile(path, 'utf-8');
    const jsonobject = JSON.parse(data);
    console.log("Json object: ", jsonobject)
}

async function writejson(path){
    const input = {
        name: "Alice",
        role: "Developer",
        skills:["Js","Node.js"]
    };
    const jsonstring = JSON.stringify(input, null, 2);
    await fs.writeFile(path, jsonstring, 'utf-8');
    console.log("Json file written")
}

writejson(filepath);
readjson(filepath);