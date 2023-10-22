import { atom } from "recoil";

//a user atom that controls the state of the user
//a key for the unique id to access/manage the state of the userAtom
//and then we get 'user-threads' from the user's local storage
const userAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user-threads")),
});

export default userAtom;
