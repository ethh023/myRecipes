import { atom } from "recoil";

//used for creating an atom for managing the user authentication state in recoil
//a recoil atom instance is created for setting a key and a default initial state of login and with a key
const authScreenAtom = atom({
  key: "authScreenAtom",
  default: "login",
});

export default authScreenAtom;
