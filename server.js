const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Lista dei giocatori attualmente connessi
let players = [];
let moves = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    // Aggiungi il nuovo giocatore alla lista dei giocatori
    players.push(socket.id);

    // Se ci sono due giocatori connessi, avvia il gioco
    if (players.length === 2) {
        io.emit('startGame');
    }

    // Gestisci la scelta del giocatore e invia il risultato agli altri giocatori
    socket.on('play', (move) => {
        moves[socket.id] = move;
        if (Object.keys(moves).length === 2) {
            const player1Move = moves[players[0]];
            const player2Move = moves[players[1]];
            const result1 = getResult(player1Move, player2Move);
            const result2 = getResult(player2Move, player1Move);
            io.to(players[0]).emit('result', result1);
            io.to(players[1]).emit('result', result2);
            // Resetta le mosse per la prossima partita
            moves = {};
        }
    });

    // Gestisci la disconnessione del giocatore
    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Rimuovi il giocatore dalla lista dei giocatori
        players = players.filter(p => p !== socket.id);
        // Resetta le mosse se il giocatore che si è disconnesso aveva fatto una mossa
        if (moves[socket.id]) {
            delete moves[socket.id];
        }
    });
});

function getResult(move1, move2) {
    // Logic to determine the winner
    // 0: Draw, 1: Player 1 wins, 2: Player 2 wins
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
