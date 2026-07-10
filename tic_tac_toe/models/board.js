function createBoard() {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
}

function displayBoard(board){
    console.log(`\n ${board[0]} | ${board[1]} | ${board[2]}`);
    console.log("---|---|---");
    console.log(` ${board[3]} | ${board[4]} | ${board[5]}`);
    console.log("---|---|---");
    console.log(` ${board[6]} | ${board[7]} | ${board[8]} \n`);
}

// const myboard = createBoard();
// displayBoard(myboard)

// console.log("\n\n")
// myboard[4] = "X"
// displayBoard(myboard)

export {createBoard, displayBoard};