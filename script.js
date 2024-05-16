const socket = io();
let username = "";

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
    } else {
        message = "Opponent wins!";
    }
    document.getElementById('result').innerText = message;
});

function getResult(playerMove, opponentMove) {
    if (playerMove === opponentMove) return 0;
    if ((playerMove === 0 && opponentMove === 2) ||
        (playerMove === 1 && opponentMove === 0) ||
        (playerMove === 2 && opponentMove === 1)) {
        return 1;
    }
    return 2;
}

function restartGame() {
    socket.emit('restartGame');
    document.getElementById('result').innerText = "";
}

function disconnect() {
    socket.emit('disconnectGame');
    document.getElementById('game').style.display = 'none';
    document.getElementById('usernameContainer').style.display = 'block';
    document.getElementById('username').value = "";
    document.getElementById('result').innerText = "";
}
