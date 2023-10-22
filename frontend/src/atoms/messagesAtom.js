import { atom } from "recoil";

//the state management for all conversations atom in recoil
//where we create 2 instances of a recoil atom, similarly to the authAtom, this is used to manage the state of conversations
//the key sets a unique key for the conversationsAtom that can be used to identify the atom's state
//then we've set the default to an empty array so that we can store at some point, an array of conversations
export const conversationsAtom = atom({
  key: "conversationsAtom",
  default: [],
});

//the state management for a selected conversation atom in recoil
//similarly above we have a key, and a default, the difference here is that where above is all conversations listed in an array, here we are getting a selected conversations data
//the key is a unique identifier that can be accessed to manage this state
//and the default is an object that contains a the id of the conversation, the current user id and the current user username
export const selectedConversationAtom = atom({
  key: "selectedConversationAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
  },
});
