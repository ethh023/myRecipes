import mongoose from "mongoose";

//defining the conversation model the messaging part of the u2u (user to user)
//will also allow us to store the data we want and retrieve the data we want
const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      seen: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
