const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { userJoin } = require('./utils');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use('/api', require('./routes/userRoutes'));

io.on('connection', socket => {
  console.log(`A user connect with ID ${socket.id}`);

  socket.on("joinRoom", ({ username, room, message }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
               
        //Welcome current user
        if (message) socket.emit("roomJoined", 'Willkommen ' + username)

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit("roomJoined", user.username);

        //Send users and room info
        // io.to(user.room).emit("roomUsers", {
        //     room: user.room,
        //     users: getRoomUsers(user.room)
        // })
    })

  socket.on('disconnect', () => {
    console.log(`A user disconnected with ID ${socket.id}`);
  });

  socket.on('button-clicked', ({username}) => {
    console.log(username + ' hat auf den button geklicked');

    socket.broadcast.to('auswertung').emit("button-clicked", username);
  });

  socket.on('q2_success', ({username}) => {
    socket.broadcast.to('auswertung').emit("q2_success", username);
  });

  socket.on('q3_success', ({username}) => {
    socket.broadcast.to('auswertung').emit("q3_success", username);
  });

  socket.on('q4_success', ({username}) => {
    socket.broadcast.to('auswertung').emit("q4_success", username);
  });

  socket.on('startGame', () => {
    socket.broadcast.emit("startGame");
  });

  socket.on('join-room', (room, callback) => {
    socket.join(room);
    callback(`Joined room "${room}"`);
  });
});

httpServer.listen(port, () => console.log(`Server start on port ${port}`));
