/*
Add your code for Game here
 */
 export default class Game {
      constructor(num){
         /*
         Initialize board and set all values to zero. 
         Note: for whatever reason, map wouldn't work so used good old fashioned for loop.
         Then adds 2 random tiles to board.
         */
         this.board = new Array(num*num);
         // this.board = this.board.map(val => val = 0);
         for(var i = 0; i < this.board.length; i++){
           this.board[i] = 0;
         }
         this.makeRandomTile();
         this.makeRandomTile();

         // initialize all the other variables
         this.score = 0;
         this.won = false;
         this.over = false;
         this.width = num;
         this.onMoveArr = [];
         this.onLoseArr = [];
         this.onWinArr = [];
         this.moved = false;
    }

    // Resets the game back to a random starting position.
    setupNewGame(){
      for(var i = 0; i < this.board.length; i++){
        this.board[i] = 0;
      }
      this.makeRandomTile();
      this.makeRandomTile();
      this.score = 0;
      this.won = false;
      this.over = false;

    }

    // Given a gameState object, it loads that board, score, etc...
    loadGame(gameState){
      this.board = gameState.board;
      this.score = gameState.score;
      this.won = gameState.won;
      this.over = gameState.over;
    }

    // Given "up", "down", "left", or "right" as string input, it makes the appropriate shifts and adds a random tile.
    move(direction) {
      this.moved = false;
      if(direction == "up"){
        // positive width
        var start = [];
        for(var i = 0; i < this.width; i++){
          start[i] = i;
        }
        this.makeItMove(this.width, start);  

      } else if(direction == "down"){
        // negative width
        var first = this.width * (this.width - 1);
        var start = [];
        for(var i = 0; i < this.width; i++){
          start[i] = first + i;
        }
        this.makeItMove((-1 * this.width), start);

      } else if(direction == "left"){
        // always +1
        var start = [];
        for(var i = 0; i < this.width; i++){
          start[i] = (i * this.width);
        }
        this.makeItMove(1, start);

      } else if (direction == "right"){
        // always -1        
        var first = (this.width - 1);
        var start = [];
        for(var i = 0; i < this.width; i++){
          start[i] = first + (i * this.width);
        }
        this.makeItMove(-1, start);
      }
      // make move then add a tile
      this.makeRandomTile();
      // call all functions listening to onMove
      for(var i = 0; i < this.onMoveArr.length; i++){
        var funct = this.onMoveArr[i];
        funct(this.getGameState());
      }

       // check if move made player win
      // if yes, game is won and call functions listening to onWin
      if(this.won == true){
        for(var i = 0; i < this.onWinArr.length; i++){
          var funct = this.onWinArr[i];
          funct(this.getGameState());
        }
      }

      // check if move made player lose the game
      // if yes, then game is lost and call functions listening to onLose
      // if there are zeros, you have room and game is not lost
      var noZeros = true;
      for(var i = 0; i < this.board.length; i++){
        if(this.board[i] == 0){
          noZeros = false;
          break;
        }
      }
      // if you don't have any zeros, you have to check if there are any possible moves
      // only when there are no possible moves is the game over
      if(noZeros == true){
        var moving = false;
        for(var i = 0; i < this.width; i++){
          for(var k = 0; k < this.width; k++){
            var index = (i * this.width) + k;
            var val = this.board[index];
            if(k == this.width - 1){
              // then you are at end of row and don't want to check +1
              if(this.board[index-1] == val ||
                this.board[index-this.width] == val ||
                this.board[index+this.width] == val){
                  moving = true;
                  continue;
              }
            } else if(k == 0){
              // then you are at beginning of row and don't want to check -1
              if(this.board[index+1] == val ||
                this.board[index-this.width] == val ||
                this.board[index+this.width] == val){
                  moving = true;
                  continue;
              }
            } else {
              // you are in the middle and want to check everywhere
              if(this.board[index-1] == val ||
                this.board[index+1] == val ||
                this.board[index-this.width] == val ||
                this.board[index+this.width] == val){
                  moving = true;
                  continue;
              } 
            }
            if(index == this.board.length - 1 && moving == false){
              this.over = true;
            }
          }
        }
      }
      
      if(this.over == true){
        for(var i = 0; i < this.onLoseArr.length; i++){
          var funct = this.onLoseArr[i];
          funct(this.getGameState());
        }
      }

    }

    makeItMove(slide, start){
      // combined array shows if spot has already been combined
      // if true, then it won't be combined again in a given move
      var combined = [];
      for(var i = 0; i < this.board.length; i++){
        combined[i] = false;
      }
      
      // need nested for loops to get through the whole board
      for(var i = 0; i < this.width; i++){
        for(var k = 0; k < this.width - 1; k++){
          var index = start[i] + (k * slide);     
          if(this.board[index] == 0){
            if(this.board[index + slide] == 0 || 
              this.board[index+slide] == undefined ||
              index + slide == start[i + slide]){
                // checks if next slot is zero, or next slot is undefined, or if next slot is in a different row/column
              continue;
            } else {
              this.board[index] = this.board[index + slide];
              this.board[index + slide] = 0;
              this.moved = true;
              k = -1;
              continue;
            }
          } else if(this.board[index] != 0){
            if(this.board[index] == this.board[index + slide] && combined[index + slide] != true && combined[index] != true){
              this.board[index] = this.board[index] * 2;
              if(this.board[index] == 2048){
                this.won = true;
              }
              this.board[index + slide] = 0;
              combined[index] = true;
              this.score += this.board[index];
              this.moved = true;
            } else {
              continue;
            }
          }
        }
      }
    }

    // Returns a string representation of the game as text/ascii. 
    // See the gameState section above for an example. This will not be graded, but it useful for your testing purposes when you run the game in the console. 
    // The run_in_console.js script uses the toString() method to print the state of the game to the console after every move.
    toString(){
      var counter = 0;
      for(var i = 0; i < this.width; i++){
        for(var k = 0; k < this.width; k++){
          process.stdout.write("[" + this.board[counter] + "]");
          counter++;
        }
        console.log('\n');
      }
      console.log("score: ", this.score);
      console.log("won: ", this.won);
      console.log("over: ", this.over);
    }

    // Takes a callback function as input and registers that function as a listener to the move event. Every time a move is made, the game should call all previously registered move callbacks, passing in the game's current gameState as an argument to the function.
    onMove(callback) {
      this.onMoveArr[this.onMoveArr.length] = callback;
    }

    // Takes a callback function as input and registers that function as a listener to the win event. When the player wins the game (by making a 2048 tile), the game should call all previously registered win callbacks, passing in the game's current gameState as an argument to the function.
    onWin(callback) {
      this.onWinArr[this.onWinArr.length] = callback;
    }

    // Takes a callback function as input and registers that function as a listener to the move event. When the game transitions into a state where no more valid moves can be made, the game should call all previously registered lose callbacks, passing in the game's current gameState as an argument to the function.
    onLose(callback) {
      this.onLoseArr[this.onLoseArr.length] = callback;
    }

    // Returns a accurate gameState object representing the current game state.
    getGameState() {
      return {board: this.board, 
              score: this.score, 
              won: this.won, 
              over: this.over };
    }

    // not required function but makes life easy
    makeRandomTile(){
      // returns random int from 0 to 9 to get tile value 
      var rand = Math.floor(Math.random() * 10);
      var tileVal;
      if(rand < 9){
        tileVal = 2;
      } else{
        tileVal = 4;
      }

      // generates random spot in array and places new tile there after checking that the value already in that spot equals zero
      var randArray = Math.floor(Math.random() * this.board.length);
      for(var i = 0; i < this.board.length * 10; i++){
        if(this.board[randArray] == 0){
          this.board[randArray] = tileVal;
          break;
        } else{
          // need new spot in array to try so get another random value
          randArray = Math.floor(Math.random() * this.board.length);
        }
      }
    }
     
 }
