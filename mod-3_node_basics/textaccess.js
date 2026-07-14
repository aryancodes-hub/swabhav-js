// const fs = require('node:fs')
import fs from 'node:fs/promises';


let filepath = "./lorem.txt"
async function readfile(path){
    const data = await fs.readFile(path, 'utf-8');
    console.log("file data: ", data)
}

async function writefile(path){
    const input = "Hello this is first input ";
    await fs.writeFile(path, input, 'utf-8');
    console.log("File written successfully.")
}



writefile(filepath);
readfile(filepath);