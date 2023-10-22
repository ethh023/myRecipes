//loads imports and dependencies needed
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import shoppingListRoutes from "./routes/shoppingListRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";

//loads .env file variables in
dotenv.config();

//initialize connection to mongo db
connectDB();

//setting port to .env PORT var otherwise use port 5000
const PORT = process.env.PORT || 5000;

//used for media and imagery on the app
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

//middlewares
//to parse JSON data in the req.body
app.use(express.json({ limit: "50mb" }));
//to parse form data in the req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
//where we send http requests to the backend from the frontend
//connected to routes which are then connected to controller that deals with how to handle http requests
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/shoppinglists", shoppingListRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

//console log to tell us the server has started
server.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
