function isValidPosition(position){    
    if (position >= 1 && position <= 9) {
        return true;
    } else {
        console.log("Invalid input, enter a position between 1-9 only.");
        return false;
    }
}
function isPositionAvailable(board, position){
    const index = position-1;
    if (board[index] !== "X" && board[index] !== "0"){
        return true
    }
    else{
        console.log("Position is not empty, select different position.")
        return false
    }
}
function updateBoard(board, position, player){
    const index = position - 1;
    board[index] = player;
}
function checkWinner(board, player){
    const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
    [0, 4, 8], [2, 4, 6]             //diagonal
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true; 
    }
  }
  
  return false;
}
function checkDraw(board){
    if(board.every(spot=> spot === "X" || spot === "0")){
        return true
    }
    else {
        return false
    }
}
function switchPlayer(currentPlayer){
    if (currentPlayer === "X") {
        return "0";
    } else {
        return "X";
    }
}

export {isPositionAvailable, isValidPosition, updateBoard, checkDraw, checkWinner, switchPlayer}