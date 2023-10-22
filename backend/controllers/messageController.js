import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

//sending a msg to a user
//we get the recipientID and the message from the request body and possibly the image if an image was sent as well
//and we also get the user's id as the sender
//then we find a conversation based on the sender id and the recipient id
//then if no conversation exists in db then create a new one with the participants(senderID and recipientID), and a message obj for the last message containing the text with the senderID
//if an img was added to the message then upload it to cloudinary for store
//then we create a new message obj to link to the conversation for every new message that is added
//and updates the conversation and changes the old last message with the new last message
//then if the recipient has a websocket open, it'll send the new message to the recipient and returns the message in the status
async function sendMessage(req, res) {
  try {
    const { recipientId, message } = req.body;
    let { img } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//get/receive msgs from a user
//get the recipients ID from the request parameters, and the current user id from the request user_.id
//check if a conversation exists in db with the recipient and current user
//if not then return error because current user is trying to get messages from a non-existant conversation exist
//else find messages obj list from conversation and sort from oldest to newest
//return messages
async function getMessages(req, res) {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//get conversations for a user
//get current user id from request
//check if any conversations exist in db with current user and when we iterate through the list of participants/recipients/non-current user, we want to retrieve their username
//then for each conversation found with current user, skip over current user because we dont need to iterate that data, just iterate the recipient/participant
//and return the list of participants usernames
async function getConversations(req, res) {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username",
    });

    // remove the current user from the participants array
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { sendMessage, getMessages, getConversations };
