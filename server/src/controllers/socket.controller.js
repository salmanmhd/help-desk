import { Server } from "socket.io";
import { server } from "../app.js";

await new Promise((resolve) => setTimeout(resolve, 2000));

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "*",
      "http://localhost:3000",
    ],
  },
});

const users = {}; // email -> socket.id
const rooms = {}; // email -> room
const messages = {}; // room -> [messages]

io.on("connection", (socket) => {
  console.log("🧑🏻User connected:", socket.id);

  // ! User end
  socket.on("login", ({ email }) => {
    const room = rooms[email] || `room-${email}`;
    users[email] = socket.id;
    rooms[email] = room;
    socket.join(room);
    if (!messages[room]) messages[room] = [];

    socket.emit("room-joined", { room, messages: messages[room] });

    socket.broadcast.to(room).emit(`new_user, ${email} joined`);
    console.log(`⭕ messages db: `, messages);
  });

  socket.on("join-room", ({ room, username }) => {
    socket.join(room);
    socket.broadcast.to(room).emit(`agent joined chat: ${username}`);
  });

  //! agent end
  socket.on("join-ticket-room", (m) => {
    socket.join("tickets");
    socket.broadcast.to("tickets").emit(`new agent logged in: ${m}`);
  });

  // ! common

  socket.on("chat", ({ room, message, email }) => {
    if (!messages[room]) messages[room] = []; // Ensure room exists
    const msg = { sender: email, text: message, time: new Date() };
    messages[room].push(msg);
    io.to(room).emit("chat", msg);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

function getIo() {
  if (!io) {
    console.log("io not initiliased yet");
    return;
  }
  return io;
}

export { getIo };
