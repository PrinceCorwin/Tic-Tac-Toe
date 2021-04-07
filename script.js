// gameBoard object
const Gameboard = (function () {
  const gameArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let player1Turn = true;
  const start = document.getElementById("start");
  start.addEventListener("click", getPlayers);
  function getPlayers() {
    //   get user input for names and marks and AI
    let player1Name = document.getElementById("player1").value;
    let player1AI = document.getElementById("hu-comp2").value;
    let player2Name = document.getElementById("player2").value;

    // default names if no user input
    player1Name = player1Name === "" ? "PLAYER 1" : player1Name;
    player2Name = player2Name === "" ? "PLAYER 2" : player2Name;
    // get player marks
    const mark1 = document.getElementById("mark1").value;
    const mark2 = mark1 === "X" ? "O" : "X";

    // create player objects
    const player1 = PlayerFactory(player1Name, mark1, false);
    const player2 = PlayerFactory(player2Name, mark2, player1AI);
    game(player1, player2);
  }
  return { gameArray, player1Turn };
})();

// player factory
const PlayerFactory = (name, mark, AI) => {
  const getName = () => name;
  const getMark = () => mark;
  const getAI = () => {
    if (AI === "true") {
      return true;
    } else {
      return false;
    }
  };
  return { getName, getMark, getAI };
};

// game function
const game = (player1, player2) => {
  // factoryFunction: show or hide "form" and "vs" elements
  function updateDisplay(displayType) {
    let vsDisplay = document.getElementById("vs");
    document.getElementById("form").style = `display: ${displayType}`;
    if (displayType === "none") {
      vsDisplay.textContent = `${player1.getName()}\u00A0\u00A0VS\u00A0\u00A0${player2.getName()}`;
      vsDisplay.style.display = "flex";
    } else {
      vsDisplay.textContent = "";
      vsDisplay.style.display = "none";
    }
  }
  updateDisplay("none");

  Gameboard.player1Turn = true;
  const boardClass = document.getElementById("gameBoard");
  boardClass.className = player1.getMark();
  //   cell event listeners
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", play);
  });

  //   gameplay after cell clicked
  function play() {
    const cellArray = [
      "grid0",
      "grid1",
      "grid2",
      "grid3",
      "grid4",
      "grid5",
      "grid6",
      "grid7",
      "grid8",
    ];
    let currentPlayer;
    if (Gameboard.player1Turn === true) {
      currentPlayer = player1;
    } else {
      currentPlayer = player2;
    }
    console.log(currentPlayer.getMark());
    // update gameArray
    let playedCell = [cellArray.indexOf(this.id)];
    console.log("playedCell " + Gameboard.gameArray[playedCell]);
    if (
      Gameboard.gameArray[playedCell] !== "X" &&
      Gameboard.gameArray[playedCell] !== "O"
    ) {
      Gameboard.gameArray[playedCell] = currentPlayer.getMark();
      console.log("here");
      //   update DOM
      this.classList.remove("empty");
      this.classList.add(currentPlayer.getMark().toLowerCase());
      if (checkGameOver(currentPlayer) === false) {
        swapTurns();
      }
    }
    // swap turns
    function swapTurns() {
      Gameboard.player1Turn = !Gameboard.player1Turn;
      if (Gameboard.player1Turn === false && player2.getAI() === true) {
        aiPlay();
        currentPlayer = player2;
        swapTurns();
      }
      if (currentPlayer === player1) {
        boardClass.className = player2.getMark();
        currentPlayer = player2;
      } else {
        boardClass.className = player1.getMark();
        currentPlayer = player1;
      }
      function aiPlay() {
        let huPlayer = player1.getMark();
        let aiPlayer = player2.getMark();

        let fc = 0;
        // let origBoard = ["X", 1, 2, 3, 4, 5, 6, 7, 8];

        // finding the ultimate play on the game that favors the computer
        let bestSpot = minimax(Gameboard.gameArray, aiPlayer);
        console.log(bestSpot);
        //loging the results
        console.log("index: " + bestSpot.index);
        console.log("function calls: " + fc);

        // the main minimax function
        function minimax(newBoard, player) {
          //add one to function calls
          fc++;

          //available spots
          let availSpots = emptyIndexies(newBoard);

          // checks for the terminal states such as win, lose, and tie and returning a value accordingly
          if (winning(newBoard, huPlayer)) {
            return { score: -10 };
          } else if (winning(newBoard, aiPlayer)) {
            return { score: 10 };
          } else if (availSpots.length === 0) {
            return { score: 0 };
          }

          // an array to collect all the objects
          let moves = [];

          // loop through available spots
          for (let i = 0; i < availSpots.length; i++) {
            //create an object for each and store the index of that spot that was stored as a number in the object's index key
            let move = {};
            move.index = newBoard[availSpots[i]];

            // set the empty spot to the current player
            newBoard[availSpots[i]] = player;

            //if collect the score resulted from calling minimax on the opponent of the current player
            if (player == aiPlayer) {
              let result = minimax(newBoard, huPlayer);
              move.score = result.score;
            } else {
              let result = minimax(newBoard, aiPlayer);
              move.score = result.score;
            }

            //reset the spot to empty
            newBoard[availSpots[i]] = move.index;

            // push the object to the array
            moves.push(move);
          }

          // if it is the computer's turn loop over the moves and choose the move with the highest score
          let bestMove;
          if (player === aiPlayer) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
              if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
              }
            }
          } else {
            // else loop over the moves and choose the move with the lowest score
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
              if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
              }
            }
          }

          // return the chosen move (object) from the array to the higher depth
          return moves[bestMove];
        }

        // returns the available spots on the board
        function emptyIndexies(board) {
          return board.filter((s) => s != "O" && s != "X");
        }

        // winning combinations using the board indexies for instace the first win could be 3 xes in a row
        function winning(board, player) {
          if (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
    //   check for gameOver after every played cell
    function checkGameOver(currentPlayer) {
      let combo;
      let winMessage = "";
      const winMessageDiv = document.getElementById("winMessage");
      const winningHands = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      //   check for win
      if (
        winningHands.some((combination) => {
          combo = combination;
          return combination.every((index) => {
            return Gameboard.gameArray[index] === currentPlayer.getMark();
          });
        })
      ) {
        //   highlight winning cells
        console.log("win");
        let counter = 0;
        let i = setInterval(function () {
          document
            .getElementById("gameBoard")
            .children[combo[counter]].classList.add("winningCell");

          counter++;
          if (counter === 3) {
            clearInterval(i);
            console.log("cleared");
          }
        }, 150);
        winMessage = currentPlayer.getName() + " WINS!";
      } else {
        //   loop through gameArray to check for tie
        for (let i = 0; i < Gameboard.gameArray.length; i++) {
          if (
            Gameboard.gameArray[i] !== "X" &&
            Gameboard.gameArray[i] !== "O"
          ) {
            return false;
          }
        }
        winMessage = "IT'S A DRAW!";
      }
      //   game over iefe
      (function () {
        //   remove cell hoverstate and EventListeners
        boardClass.className = "";
        const removeListeners = document.querySelectorAll(".cell");
        removeListeners.forEach((cell) => {
          cell.removeEventListener("click", play);
        });
        // add text for winner or draw to winMessageDiv element and display it
        winMessageDiv.firstChild.textContent = winMessage;
        setTimeout(() => {
          winMessageDiv.style.width = "100%";
        }, 1500);
        setTimeout(() => {
          winScreen();
        }, 2000);
        return true;
      })();
      function winScreen() {
        //   clearState
        Gameboard.gameArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
          cell.classList = "cell empty";
        });

        // eventListeners for reset and play again buttons
        const reset = document.getElementById("reset");
        reset.addEventListener("click", function () {
          Gameboard.player1Turn = true;
          document.getElementById("form").reset();
          console.log("reset");
          updateDisplay("flex");
          winMessageDiv.style.width = "0";
        });
        const replay = document.getElementById("replay");
        replay.addEventListener("click", function () {
          console.log("replay");
          Gameboard.player1Turn = true;
          //   add cell event listeners back
          const cells = document.querySelectorAll(".cell");
          cells.forEach((cell) => {
            cell.addEventListener("click", play);
          });
          boardClass.className = player1.getMark();

          winMessageDiv.style.width = "0";
        });
      }
    }
  }
};
