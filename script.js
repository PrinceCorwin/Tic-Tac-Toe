// gameBoard object
const Gameboard = (function () {
  const gameArray = ["", "", "", "", "", "", "", "", ""];

  return {
    gameArray: gameArray,
  };
})();

// player factory
const Players = (name, mark, AI) => {
  const getName = () => name;
  const getMark = () => mark;
  //   AI variable for later refactoring to include
  const getAI = () => AI;
  return { getName, getMark, getAI };
};

// event listeners, hide form, hover-state module
const listeners = (function () {
  //   add event listener for play button
  document.getElementById("start").addEventListener("click", function () {
    //   get player names and marks and create player objects
    const bothPlayers = getPlayers();

    // hide form
    updateDisplay(bothPlayers, "none").displayForm();

    // event listeners for game cells
    cellsListen(bothPlayers);
  });

  //   getPlayer function
  getPlayers = () => {
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
    const player1 = Players(player1Name, mark1, false);
    player1.turn = true;
    const player2 = Players(player2Name, mark2, false);
    return { player1, player2 };
  };

  // event listeners for board cells after user input for names and mark
  cellsListen = (players) => {
    document.getElementById("gameBoard").className = players.player1.getMark();

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      cell.addEventListener("click", function () {
        game.handleClick(players, index);
      });
    });
  };
})();

// factoryFunction: show or hide form and vs elements
const updateDisplay = (players, displayType) => {
  const displayForm = () => {
    document.getElementById("form").style = `display: ${displayType}`;
    if (displayType === "none") {
      document.getElementById(
        "vs"
      ).textContent = `${players.player1.getName()} VS ${players.player2.getName()}`;
    } else {
      document.getElementById("vs").textContent = "";
    }
  };

  return { displayForm };
};

// game module
const game = (function () {
  const handleClick = (players, index) => {
    if (Gameboard.gameArray[index] !== "") {
      return;
    } else {
      play(players, index);
    }
  };
  const play = (players, index) => {
    const player1Mark = players.player1.getMark();
    const player2Mark = players.player2.getMark();
    // set #gameBoard class to opposite player for hover-state
    let hoverClass = document.getElementById("gameBoard");
    // remove "empty" class from played squares
    playedCell = hoverClass.children[index].classList;
    playedCell.remove("empty");
    if (players.player1.turn === true) {
      Gameboard.gameArray[index] = player1Mark;
      //   add "x" class to played cell to add mark to DOM
      playedCell.add(player1Mark.toLowerCase());
      //   check for player1 win or tie
      checkGameOver(players.player1.getName(), player1Mark);
      hoverClass.className = player2Mark;
    } else {
      Gameboard.gameArray[index] = player2Mark;
      //   add "o" class to played cell to add mark to DOM
      playedCell.add(player2Mark.toLowerCase());
      //   check for player2 win or tie
      checkGameOver(players.player2.getName(), player2Mark);
      hoverClass.className = player1Mark;
    }
    players.player1.turn = !players.player1.turn;
  };

  return { handleClick };
})();

// check for game over (win, tie)
const checkGameOver = (playerName, playerMark) => {
  let winMessage;
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

  //   check for win or tie
  if (
    winningHands.some((combination) => {
      return combination.every((index) => {
        return Gameboard.gameArray[index] === playerMark;
      });
    })
  ) {
    winMessage = playerName + " WINS!";
  } else {
    for (let i = 0; i < Gameboard.gameArray.length; i++) {
      if (Gameboard.gameArray[i] === "") {
        return;
      }
    }
    winMessage = "DRAW!";
  }
  // add text for winner or draw to winMessageDiv element and display it
  winMessageDiv.textContent = winMessage;
  //   document.getElementById("gameBoard").style.zIndex = 8000;

  winMessageDiv.style.width = "100%";
};
