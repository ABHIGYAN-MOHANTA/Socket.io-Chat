require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const Room = require("./room");

const server = http.createServer(app);
app.use(express.static(__dirname + "/public"));

const io = new Server(server);

const room = new Room();

io.on("connection", async (socket) => {
  const roomID = await room.joinRoom();
  // join room
  socket.join(roomID);

  socket.on("send-message", (message) => {
    socket.to(roomID).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    // leave room
    room.leaveRoom(roomID);
  });
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/chat.html");
});

server.on("error", (err) => {
  console.log("Error opening server");
});

server.listen(process.env.PORT || 8001, () => {
  console.log("Server working on port");
});
