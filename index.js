const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

const PORT = process.env.PORT || 5500

app.use(cors())
app.get('/', (req, res) => {
  res.send("HELLO, I'M A SERVER TO TIC-TAC-TOE GAME!");
});

const rooms = {};
const STATUS = {
  'PLAYING': 1,
  'WIN': 2,
  'DRAW': 3,
  'PAUSE': 0,
}

const conditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

io.on('connection', (socket) => {
  socket.on("create", room => {
    rooms[room.code] = {
      code: room.code,
      password: room.password,
      cells: ['', '', '', '', '', '', '', '', ''],
      currents: [{ player: 1, game: 'X' }, { player: 2, game: 'O' }],
      player1: socket.id,
      player2: undefined,
      status: STATUS.PAUSE,
      rounds: 0,
    };
    socket.join(room.code);
    socket.emit("create", { ...rooms[room.code], socketId: socket.id }); // INFORMAMOS QUE SE CREO UNA SALA AL USUARIO
  });
  socket.on("join", room => {
    let roomToJoin = rooms[room.code];
    if (!roomToJoin || !(roomToJoin.password == room.password)) return socket.emit("join-refused", room.code);
    if (roomToJoin.player1 && roomToJoin.player2) return socket.emit("join-failed", room.code);
    socket.join(room.code);
    if (!roomToJoin.player1 && roomToJoin.player2) rooms[room.code].player1 = socket.id;
    if (!roomToJoin.player2 && roomToJoin.player1) rooms[room.code].player2 = socket.id;
    if (!roomToJoin.player2 && !roomToJoin.player1) rooms[room.code].player1 = socket.id;
    rooms[room.code].status = STATUS.PLAYING; // CAMBIAMOS AJUSTES DE SALA
    socket.emit("join", { ...rooms[room.code], socketId: socket.id }); // INFORMAMOS QUE SE CONECTO A LA SALA
    socket.to(room.code).emit("room-join", rooms[room.code]); // INFORMAMOS QUE SE UNIO UN JUGADOR
  });
  socket.on("move", room => {
    rooms[room.code].currents = rooms[room.code].currents.reverse()
    rooms[room.code].cells[room.move.index] = room.move.current;
    rooms[room.code].rounds++;
    for (let i = 0; i < conditions.length; i++) {
      let condition = conditions[i];
      let a = rooms[room.code].cells[condition[0]];
      let b = rooms[room.code].cells[condition[1]];
      let c = rooms[room.code].cells[condition[2]];
      socket.to(room.code).emit("move", { room: rooms[room.code], move: room.move });
      if (a == '' || b == '' || c == '') {
        continue;
      }
      if ((a == b) && (b == c)) {
        rooms[room.code].status = STATUS.WIN;
        let res = { room: rooms[room.code], winner: room.move.current == 'X' ? 1 : 2 };
        socket.to(room.code).emit("result", res);
        socket.emit("result", res);
        return;
      }
    }
    if (rooms[room.code].status == STATUS.PLAYING) {
      if (rooms[room.code].rounds > 8) {
        rooms[room.code].status = STATUS.DRAW;
        let res = { room: rooms[room.code], winner: undefined };
        socket.to(room.code).emit("result", res);
        socket.emit("result", res);
        return;
      }
    }
  });
  socket.on("reset", room => {
    let roomInGame = rooms[room.code];
    rooms[room.code] = {
      ...roomInGame, 
      cells: ['', '', '', '', '', '', '', '', ''],
      rounds: 0,
      status: STATUS.PLAYING,
    }
    socket.to(room.code).emit("reset", rooms[room.code]);
    socket.emit("reset", rooms[room.code]);
  });
  socket.on("request", room => {
    socket.to(room.code).emit("request", rooms[room.code]);
  });
  socket.on("accepted", room => {
    socket.to(room.code).emit("accepted", rooms[room.code]);
  });
  socket.on("leave", room => {
    socket.leave(room.code);
    let roomLeave = rooms[room.code];
    if(!roomLeave) return
    if(roomLeave.player1 && roomLeave.player1 == socket.id) rooms[room.code].player1 = undefined;
    if(roomLeave.player2 && roomLeave.player2 == socket.id) rooms[room.code].player2 = undefined;
    if(!rooms[room.code].player1 && !rooms[room.code].player2) {
      delete rooms[room.code];
    } else {
      rooms[room.code].status = STATUS.PAUSE;
    }
    socket.to(room.code).emit("leave", rooms[room.code]);
  });
});

http.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
