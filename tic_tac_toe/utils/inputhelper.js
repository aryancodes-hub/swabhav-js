import readline from "readline/promises";
import {stdin as input, stdout as output} from 'process';

const rl = readline.createInterface({input, output});

async function askQuestion(question) {
    const input = await rl.question(question)
    return input
}

function closeInput(){
    rl.close()
}

export {askQuestion, closeInput};