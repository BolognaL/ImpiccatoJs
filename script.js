const socket = io();
let username = "";
let playerScore = 0;
let opponentScore = 0;

function startGame() {
    username = document.getElementById('username').value.trim();
    if (username === "") {
        alert("Please enter your name!");
        return;
    }
    socket.emit('startGame', username);
    document.getElementById('usernameContainer').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('usernameDisplay').innerText = `Welcome, ${username}!`;
}

function play(move) {
    socket.emit('play', move);
}

socket.on('result', (result) => {
    let message;
    if (result === 0) {
        message = "It's a draw!";
    } else if (result === 1) {
        message = "You win!";
        playerScore++;
    } else {
        message = "Opponent wins!";
        opponentScore++;
    }
    document.getElementById('result').innerText = message;
    updateScores();
});

function updateScores() {
    document.getElementById('playerScore').innerText = `You: ${playerScore}`;
    document.getElementById('opponentScore').innerText = `Opponent: ${opponentScore}`;
}

function restartGame() {
    socket.emit('restartGame');
    document.getElementById('result').innerText = "";
    playerScore = 0;
    opponentScore = 0;
    updateScores();
}

function disconnect() {
    socket.emit('disconnectGame');
    document.getElementById('game').style.display = 'none';
    document.getElementById('usernameContainer').style.display = 'block';
    document.getElementById('username').value = "";
    document.getElementById('result').innerText = "";
    playerScore = 0;
    opponentScore = 0;
    updateScores();
}
