let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let aiActive = false;
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let scores = { X: 0, O: 0, ties: 0 };

const cells = document.querySelectorAll(".grid div");
const currentTurnSpan = document.getElementById("current-turn");
const resetBtn = document.getElementById("reset-btn");
const aiToggleBtn = document.getElementById("ai-toggle");

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => cellClick(index));
});

resetBtn.addEventListener("click", resetGame);
aiToggleBtn.addEventListener("click", toggleAI);

function cellClick(index) {
  if (gameBoard[index] === "" && gameActive) {
    gameBoard[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());
    if (checkWin()) {
      endGame(false);
    } else if (checkDraw()) {
      endGame(true);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      currentTurnSpan.textContent = currentPlayer;
      if (aiActive && currentPlayer === "O") {
        setTimeout(aiMove, 500);
      }
    }
  }
}

function checkWin() {
  return winCombos.some((combo) => {
    if (
      gameBoard[combo[0]] &&
      gameBoard[combo[0]] === gameBoard[combo[1]] &&
      gameBoard[combo[0]] === gameBoard[combo[2]]
    ) {
      combo.forEach((index) => cells[index].classList.add("winner"));
      return true;
    }
    return false;
  });
}

function checkDraw() {
  return gameBoard.every((cell) => cell !== "");
}

function endGame(isDraw) {
  gameActive = false;
  if (isDraw) {
    scores.ties++;
    alert("¡Empate!");
  } else {
    scores[currentPlayer]++;
    alert(`¡${currentPlayer} ha ganado!`);
  }
  updateScoreDisplay();
}

function resetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "winner");
  });
  currentTurnSpan.textContent = currentPlayer;
}

function updateScoreDisplay() {
  document.getElementById("score-x").textContent = scores.X;
  document.getElementById("score-o").textContent = scores.O;
  document.getElementById("score-ties").textContent = scores.ties;
}

function toggleAI() {
  aiActive = !aiActive;
  aiToggleBtn.textContent = aiActive
    ? "Jugar contra Humano"
    : "Jugar contra IA";
  resetGame();
}

function aiMove() {
  if (!gameActive) return;

  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === "") {
      gameBoard[i] = "O";
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  cellClick(bestMove);
}

function minimax(board, depth, isMaximizing) {
  if (checkWinForMinimax("O")) return 1;
  if (checkWinForMinimax("X")) return -1;
  if (checkDraw()) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinForMinimax(player) {
  return winCombos.some((combo) => {
    return (
      gameBoard[combo[0]] === player &&
      gameBoard[combo[1]] === player &&
      gameBoard[combo[2]] === player
    );
  });
}

updateScoreDisplay();
