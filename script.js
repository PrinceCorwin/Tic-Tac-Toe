// gameBoard object
const Gameboard = (function () {
  const gameArray = ["", "", "", "", "", "", "", "", ""];
  let player1Turn = true;
  const start = document.getElementById("start");
  start.addEventListener("click", getPlayers);
  function getPlayers() {
    //   get user input for names and marks
    let player1Name = document.getElementById("player1").value;

    let player2Name = document.getElementById("player2").value;

    // default names if no user input
    player1Name = player1Name === "" ? "PLAYER 1" : player1Name;
    player2Name = player2Name === "" ? "PLAYER 2" : player2Name;
    // get player marks
    const mark1 = document.getElementById("mark1").value;
    const mark2 = mark1 === "X" ? "O" : "X";

    // create player objects
    const player1 = PlayerFactory(player1Name, mark1, false);
    const player2 = PlayerFactory(player2Name, mark2, false);
    game(player1, player2);
  }
  return { gameArray, player1Turn };
})();

// player factory
const PlayerFactory = (name, mark, AI) => {
  const getName = () => name;
  const getMark = () => mark;
  //   AI variable for later refactoring to include
  const getAI = () => AI;
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
    if (Gameboard.gameArray[playedCell] === "") {
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
      if (currentPlayer === player1) {
        boardClass.className = player2.getMark();
        currentPlayer = player2;
      } else {
        boardClass.className = player1.getMark();
        currentPlayer = player1;
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
        var counter = 0;
        var i = setInterval(function () {
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
          if (Gameboard.gameArray[i] === "") {
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
        Gameboard.gameArray = ["", "", "", "", "", "", "", "", ""];
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

// // event listeners, hide form, hover-state module
// const listeners = (function () {
//   //   add event listener for play button
//   document.getElementById("start").addEventListener("click", function () {
//     //   get player names and marks and create player objects
//     const bothPlayers = getPlayers();
//     // hide form
//     updateDisplay(bothPlayers, "none").displayForm();

//     // event listeners for game cells
//     cellsListen();
//   });

//   //   getPlayer function
//   getPlayers = () => {
//     //   get user input for names and marks
//     let player1Name = document.getElementById("player1").value;

//     let player2Name = document.getElementById("player2").value;

//     // default names if no user input
//     player1Name = player1Name === "" ? "PLAYER 1" : player1Name;
//     player2Name = player2Name === "" ? "PLAYER 2" : player2Name;

//     // get player marks
//     const mark1 = document.getElementById("mark1").value;
//     const mark2 = mark1 === "X" ? "O" : "X";

//     // create player objects
//     const player1 = Players(player1Name, mark1, false);
//     player1.turn = true;
//     const player2 = Players(player2Name, mark2, false);
//     return { player1, player2 };
//   };

//   // event listeners for board cells after user input for names and mark
//   const cellsListen = () => {
//     document.getElementById("gameBoard").className =
//       listeners.getPlayers.player1;
//     console.log(getPlayers.player1);

//     const cells = document.querySelectorAll(".cell");
//     cells.forEach((cell, index) => {
//       cell.addEventListener("click", function () {
//         game.handleClick(players, index);
//       });
//     });
//   };
//   return { getPlayers };
// })();

// // factoryFunction: show or hide "form" and "vs" elements
// const updateDisplay = (players, displayType) => {
//   const displayForm = () => {
//     document.getElementById("form").style = `display: ${displayType}`;
//     if (displayType === "none") {
//       document.getElementById(
//         "vs"
//       ).textContent = `${players.player1.getName()} VS ${players.player2.getName()}`;
//     } else {
//       document.getElementById("vs").textContent = "";
//     }
//   };

//   return { displayForm };
// };

// // game module
// const game = (function () {
//   const handleClick = (players, index) => {
//     if (Gameboard.gameArray[index] !== "") {
//       return;
//     } else {
//       play(players, index);
//     }
//   };
//   const play = (players, index) => {
//     const player1Mark = players.player1.getMark();
//     const player2Mark = players.player2.getMark();

//     // set #gameBoard class to opposite player for hover-state
//     let hoverClass = document.getElementById("gameBoard");

//     // remove "empty" class from played squares
//     let playedCell = hoverClass.children[index].classList;
//     playedCell.remove("empty");
//     if (players.player1.turn === true) {
//       Gameboard.gameArray[index] = player1Mark;
//       //   add "x" class to played cell to add mark to DOM
//       playedCell.add(player1Mark.toLowerCase());
//       //   check for player1 win or tie
//       let gameOver = checkGameOver(players.player1.getName(), player1Mark);
//       if (gameOver === false) {
//         hoverClass.className = player2Mark;
//         players.player1.turn = !players.player1.turn;
//       } else {
//         clearState();
//       }
//     } else {
//       Gameboard.gameArray[index] = player2Mark;
//       //   add "o" class to played cell to add mark to DOM
//       playedCell.add(player2Mark.toLowerCase());
//       //   check for player2 win or tie
//       let gameOver = checkGameOver(players.player2.getName(), player2Mark);
//       if (gameOver === false) {
//         hoverClass.className = player1Mark;
//         players.player1.turn = !players.player1.turn;
//       } else {
//         clearState();
//       }
//     }
//   };

//   return { handleClick };
// })();

// // check for game over (win, tie)
// const checkGameOver = (playerName, playerMark) => {
//   let winMessage = "";
//   const winMessageDiv = document.getElementById("winMessage");
//   const winningHands = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];

//   //   check for win or tie
//   if (
//     winningHands.some((combination) => {
//       return combination.every((index) => {
//         return Gameboard.gameArray[index] === playerMark;
//       });
//     })
//   ) {
//     winMessage = playerName + " WINS!";
//   } else {
//     for (let i = 0; i < Gameboard.gameArray.length; i++) {
//       if (Gameboard.gameArray[i] === "") {
//         return false;
//       }
//     }
//     winMessage = "IT'S A DRAW!";
//   }
//   // add text for winner or draw to winMessageDiv element and display it
//   winMessageDiv.firstChild.textContent = winMessage;

//   winMessageDiv.style.width = "100%";
// };
