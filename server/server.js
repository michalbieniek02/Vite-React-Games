const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const allUsers = {};

io.on("connection", (socket) => {
  socket.on("create_room", (data) => {
    const roomId = `tic-tac-toe/${socket.id}`;
    socket.join(roomId);
    allUsers[socket.id] = {
      socket: socket,
      playerName: data.playerName,
      roomId: roomId,
      playing: true,
    };
    socket.emit("room_created", { roomId: roomId });
  });

  socket.on("join_room", (data) => {
    const roomId = data.roomId;
    const room = io.sockets.adapter.rooms.get(roomId);

    if (room && room.size === 1) {
      socket.join(roomId);
      const [opponentSocketId] = Array.from(room);
      const opponentPlayer = allUsers[opponentSocketId];

      allUsers[socket.id] = {
        socket: socket,
        playerName: data.playerName,
        roomId: roomId,
        playing: true,
      };

      const currentUser = allUsers[socket.id];

      io.to(roomId).emit("OpponentFound", {
        player1: {
          playerName: opponentPlayer.playerName,
          playingAs: "cross",
        },
        player2: {
          playerName: currentUser.playerName,
          playingAs: "circle",
        },
      });

      socket.on("playerMoveFromClient", (moveData) => {
        socket.to(roomId).emit("playerMoveFromServer", moveData);
      });

      socket.on("disconnect", () => {
        socket.to(roomId).emit("opponentLeftMatch");
      });
    } else {
      socket.emit("room_not_found");
    }
  });

  socket.on("disconnect", () => {
    const user = allUsers[socket.id];
    if (user && user.roomId) {
      socket.to(user.roomId).emit("opponentLeftMatch");
    }
    delete allUsers[socket.id];
  });
});

httpServer.listen(3000);
