import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

//using websockets we can have the feature of live chat between users
//we create a node js http server that we run our web sockets off of because web sockets are layered on top of the http protocol
//for the web sockets to work we need this server and then an http handshake between the web sockets and the server
//then add an instance of the socket to the server
//an object named userSocketMap is initialized to map user IDs to their respective socket IDs. the purpose of this mapping is used to identify the correct socket for a user to send messages or updates.
//then a connection event takes place when a user connects to the websocket server:
//it logs that a user has connected and logs the socket ID of the user.
//retrieves the userId from the client's handshake query, allowing the server to associate the WebSocket connection with that specific user.
//stores the userId and the associated socket ID in the userSocketMap object.
//emits a getOnlineUsers event to all connected clients, sending an array of user IDs (keys in the userSocketMap) to inform clients about online users.
//this event handler is used for marking messages in a conversation as seen by a user:
//when a client sends this event, it updates the message and conversation records to mark messages as seen.
//emits a messagesSeen event to the recipient user to indicate that their messages have been seen.
//this event handler is triggered when a client disconnects from the WebSocket server:
//it logs that a user has disconnected.
//deletes the userId from the userSocketMap to indicate that the user is offline.
//emits a getOnlineUsers event to inform other clients about the updated list of online users.

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId: socketId

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId != "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } }
      );
      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { "lastMessage.seen": true } }
      );
      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
