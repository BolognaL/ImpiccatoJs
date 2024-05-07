const socket = io();

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
    // Logic to determine the winner
    // 0: Draw, 1: Player wins, 2: Opponent wins
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
