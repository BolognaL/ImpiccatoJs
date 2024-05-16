const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let players = [];
let moves = {};
let usernames = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('startGame', (username) => {
        players.push(socket.id);
        usernames[socket.id] = username;
        if (players.length === 2) {
            io.emit('startGame', usernames);
        }
    });

    socket.on('play', (move) => {
        moves[socket.id] = move;
        if (Object.keys(moves).length === 2) {
            const player1Move = moves[players[0]];
            const player2Move = moves[players[1]];
            const result1 = getResult(player1Move, player2Move);
            const result2 = getResult(player2Move, player1Move);
            io.to(players[0]).emit('result', result1);
            io.to(players[1]).emit('result', result2);
            moves = {};
        }
    });

    socket.on('disconnectGame', () => {
        console.log('User disconnected from game');
        players = players.filter(p => p !== socket.id);
        if (players.length > 0) {
            io.emit('playerDisconnected');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        delete usernames[socket.id];
    });
});

function getResult(move1, move2) {
    if (move1 === move2) return 0;
    if ((move1 === 0 && move2 === 2) ||
        (move1 === 1 && move2 === 0) ||
        (move1 === 2 && move2 === 1)) {
        return 1;
    }
    return 2;
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
