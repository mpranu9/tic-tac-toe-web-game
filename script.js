let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let currentPlayer = "X";
let gameMode = ""; // player or ai

let xWins = 0;
let oWins = 0;
let draws = 0;

const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const difficultySelect = document.getElementById("difficulty");

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

// SET GAME MODE
function setMode(mode) {
    gameMode = mode;
    restartGame();
    gameActive = true;

    if (mode === "player") {
        message.innerText = "👥 Player X's Turn";
    } else {
        message.innerText = "🤖 You vs AI! Your Turn (X)";
    }
}

// CLICK HANDLER
function handleClick() {
    const index = this.getAttribute("data-index");

    if (!gameActive || board[index] !== "") return;

    makeMove(index, currentPlayer);

    if (gameMode === "ai" && gameActive && currentPlayer === "O") {
        setTimeout(computerMove, 400);
    }
}

// MAKE MOVE
function makeMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateMessage();
}

// UPDATE MESSAGE (FUN TEXT)
function updateMessage() {
    if (gameMode === "player") {
        message.innerText = `🎯 Player ${currentPlayer}'s Turn`;
    } else {
        if (currentPlayer === "X") {
            message.innerText = "😊 Your Turn!";
        } else {
            message.innerText = "🤖 AI is thinking...";
        }
    }
}

// COMPUTER MOVE
function computerMove() {
    let difficulty = difficultySelect.value;

    if (difficulty === "easy") {
        randomMove();
    } else {
        bestMove();
    }
}

// EASY AI
function randomMove() {
    let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    let move = empty[Math.floor(Math.random() * empty.length)];
    makeMove(move, "O");
}

// HARD AI (MINIMAX)
function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    makeMove(move, "O");
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinnerMini();

    if (result !== null) return result;

    if (isMaximizing) {
        let best = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                best = Math.max(score, best);
            }
        }
        return best;

    } else {
        let best = Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                best = Math.min(score, best);
            }
        }
        return best;
    }
}

function checkWinnerMini() {
    for (let pattern of winPatterns) {
        let [a,b,c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            if (board[a] === "O") return 1;
            if (board[a] === "X") return -1;
        }
    }

    if (!board.includes("")) return 0;
    return null;
}

// CHECK WINNER
function checkWinner() {
    for (let pattern of winPatterns) {
        let [a,b,c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {

            gameActive = false;

            if (board[a] === "X") xWins++;
            else oWins++;

            message.innerText = `🎉 Player ${board[a]} Wins!`;
            updateScore();
            return true;
        }
    }

    if (!board.includes("")) {
        draws++;
        gameActive = false;
        message.innerText = "🤝 It's a Draw!";
        updateScore();
        return true;
    }

    return false;
}

// SCORE UPDATE
function updateScore() {
    document.getElementById("score").innerText =
        `X: ${xWins} | O: ${oWins} | Draws: ${draws}`;
}

// RESTART
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    cells.forEach(cell => cell.innerText = "");

    if (gameMode === "player") {
        message.innerText = "👥 Player X's Turn";
    } else if (gameMode === "ai") {
        message.innerText = "😊 Your Turn!";
    } else {
        message.innerText = "Choose Game Mode";
        gameActive = false;
    }
}