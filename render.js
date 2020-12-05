// import keypress from "./node_modules/keypress";
import Game from "./engine/game.js";
//keypress(process.stdin);
// gonna change

var game = new Game(4);

export const loadGame = function() {
    // Grab a jQuery reference to the root HTML element
    loadBoard(game.getGameState());    
      
    // add listeners to game
    game.onMove(loadBoard);    
    game.onWin(handleWin);    
    game.onLose(handleLoss);
    
    // TODO: Use jQuery to add newGameButtonPress() as an event handler for
    //       clicking the new game button
    $(document).on("click", ".reset", newGameButtonPress);   
    
   // $root.on("keydown", handleKeyPress);
    $(document).keydown(handleKeyPress);
};

export const handleWin = function(gameState){
    $(".score").replaceWith(`<h4 class = "tile is-child is-12 title is-4 box score" style ="background-color: orange; text-align: center">You won!! Keep pressing arrow keys to keep playing <br>Score: ${gameState.score}</h4>`);
}

export const handleLoss = function(gameState){
    $(".score").replaceWith(`<h4 class = "tile is-child is-12 title is-4 box score" style ="background-color: orange; text-align: center">You lost :( Your score was ${gameState.score} <br> Press NEW GAME to play again.</h4>`);
}

export const handleKeyPress = function(event) {
    // event.preventDeafult();
    var key = event.keyCode;
    if (key == 37) {
        game.move("left");
    } else if (key == '38') {
        event.preventDefault();
        game.move("up");
    } else if (key == '39') {
        game.move("right");
    } else if (key == '40') {
        event.preventDefault();
        game.move("down");
    } 
};

export const loadBoard = function(gameState) {
      
    $(".score").replaceWith(`<h4 class = "tile is-child is-12 title is-4 box score" style ="background-color: orange; text-align: center">Score: ${gameState.score}</h4>`);

   for(var i = 0; i < gameState.board.length; i++){
       if(gameState.board[i] == 0){
           $(`.${i}`).replaceWith(`<div class = "tile is-child box ${i}" style = "background-color: #8CBFFF; border: solid;"><h3 class = "title" style = "text-align: center; color: #8CBFFF;">0</h3></div>`);
       } else {
            $(`.${i}`).replaceWith(`<div class = "tile is-child box ${i}" style = "background-color: #8CBFFF; border: solid;"><h3 class = "title" style = "text-align: center;">${gameState.board[i]}</h3></div>`);
       }
   }
}

export const newGameButtonPress = function(event) {
    game.setupNewGame();
    loadBoard(game.getGameState());
}

/**
 * Use jQuery to execute the loadGame function after the page loads
 */
$(function() {
    loadGame();
});

// $(document).ready(() => {
//     loadGame();
// });