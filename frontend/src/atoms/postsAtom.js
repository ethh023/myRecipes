import { atom } from "recoil";

//a post state management atom in recoil
//a unique key to access to state, (postsAtom)
//and an empty array set as default which as posts are published, the array with then be filled with them
const postsAtom = atom({
  key: "postsAtom",
  default: [],
});

export default postsAtom;
