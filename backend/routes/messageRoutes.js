import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  getMessages,
  sendMessage,
  getConversations,
} from "../controllers/messageController.js";

const router = express.Router();

//routes that we send http requests through, the code for these routes are in the controllers which we call here, and also call protectRoute if we want user auth to be included
router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);

export default router;
