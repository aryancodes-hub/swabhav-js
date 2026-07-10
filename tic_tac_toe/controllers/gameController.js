import {askQuestion, closeInput} from "../utils/inputhelper.js";
import {isPositionAvailable, isValidPosition, updateBoard, checkDraw, checkWinner, switchPlayer} from "../services/gameService.js"
import { createBoard, displayBoard } from "../models/board.js";


async function processPlayerMove(board, currentPlayer){
    let validmove = false;

    while(!validmove){
        const input = await askQuestion(`Player ${currentPlayer}, enter a valid move: `)
    
        if (isValidPosition(input) && isPositionAvailable(board, input)){
            updateBoard(board, input, currentPlayer);
            validmove = true;
        }
    }
}
async function startGame(){
    const myboard = createBoard();
    let currentPlayer = "X"
    let gameActive = true

    while(gameActive){
        displayBoard(myboard);
        await processPlayerMove(myboard, currentPlayer);

        if(checkWinner(myboard, currentPlayer)){
            console.log(`Player ${currentPlayer} is the WINNER. Congratulations.`)
            displayBoard(myboard);
            gameActive = false
        }
        else if(checkDraw(myboard)){
            console.log("Game is draw.")
            gameActive = false;
        } 
        else {
            currentPlayer = switchPlayer(currentPlayer)
        }
    }

    closeInput();

}

export {processPlayerMove, startGame}