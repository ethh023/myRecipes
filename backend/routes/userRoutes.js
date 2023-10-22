import express from "express";
import {
  followUnFollowUser,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
  getSuggestedUsers,
  deleteUser,
  getAllUsers,
  getSingleUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

//routes that we send http requests through, the code for these routes are in the controllers which we call here, and also call protectRoute if we want user auth to be included
router.get("/", protectRoute, getAllUsers);
router.get("/:username", protectRoute, getSingleUser);
router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
router.put("/update/:id", protectRoute, updateUser);
router.delete("/delete/:id", protectRoute, deleteUser);

export default router;
