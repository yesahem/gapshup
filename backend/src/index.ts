import { WebSocket, WebSocketServer } from "ws";
import "dotenv/config";
const wss = new WebSocketServer({ port: Number(process.env.PORT) });

interface User {
  socket: WebSocket;
  room: string;
}

let clientsConnected: User[] = [];

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string);
    console.log(parsedMessage);

    console.log("user wants to join the room ");
    if (parsedMessage.type == "join") {
      clientsConnected.push({
        socket,
        room: parsedMessage.payload.roomID,
      });
    }

    if (parsedMessage.type == "chat") {
      let connectedUsers = null;
      for (let i = 0; i < clientsConnected.length; i++) {
        if (clientsConnected[i].socket == socket) {
          connectedUsers = clientsConnected[i].room;
        }
      }

      for (let i = 0; i < clientsConnected.length; i++) {
        if (clientsConnected[i].room == connectedUsers) {
          clientsConnected[i].socket.send(parsedMessage.payload.message);
        }
      }
    }
  });

  socket.on("close", (socket) => {
    console.log("disconnect");
  });
});
