import mongoose from "mongoose";

//defining the message model for u2u (user to user) comms
//will also allow us to store the data we want and retrieve the data we want
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    seen: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
