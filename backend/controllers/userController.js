import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

//to get all users in the DB
//send a request to find all users and return all of them
//else a server error occurs
const getAllUsers = (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json("Error: " + err));
};

//get single user in DB
//take in username, and sent request to DB to find one user with that username
//if we've got the user then return it's user info
//else no user exists or a server error occured
const getSingleUser = (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
};

//specifically used for the getUserProfile hook -> UserPage
const getUserProfile = async (req, res) => {
  //we will fetch user profile either with username or userId
  //query is either username or userId
  const { query } = req.params;

  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "Page not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

//create new user
//check if user already exists
//hash the pw for security
//create user
//create jwt token & cookie
const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email }] }); //can edit this so that acc's can use same emails instead of unique emails for each acc

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

//log user in -> check if username exists in DB & username, pw are correct -> get jwt token & cookie
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

//log user out
//invalidate the jwt token (in frontend we'll send them to login screen)
const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

//work in progress - get user._id and find user by their id -> if the same id that is passed through === the req.user._id that is matched in the find user (user._id) then the user is attempting to follow themselves,
//if user_id != req.user._id & user not found by user._id then the current user is attempting to follow another user that doesnt exist in the DB
//otherwise, check if user is already following them and if they are, and they sent a request to follow/unfollow then unfollow them
//else if they do exist and arent followed and sent a request to follow/unfollow then follow the user
const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in followUnFollowUser: ", err.message);
  }
};

//update user info -> we take in user params from body and find the user by their id
//if user._id is sent through and doesnt exist in the DB then no user is found and user doesnt exist
//if user._id doesnt match the current user then the current user is trying to edit someone elses profile
//otherwise then user._id === current user that was matched and found in the DB so therefore we can continue
//if password in req.body and user has changed the password then we'll update the hash
//then other fields with new updated info that were sent through the body, we'll update the rest of them too
//update the DB and make the password null for more security
const updateUser = async (req, res) => {
  const { username, email, password, bio } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    user = await user.save();

    //work in progress - we find all posts that this user replied and update username and userProfilePic fields
    // await Post.updateMany(
    //   { "replies.userId": userId },
    //   {
    //     $set: {
    //       "replies.$[reply].username": user.username,
    //     },
    //   },
    //   { arrayFilters: [{ "reply.userId": userId }] }
    // );

    // password should be null in response
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};

//get user id from req obj
//then find the users who you are following
//then we find 5 users that the user isnt following and removes the users from the list that the user already follows
//and for the users that exist, set their password to null for security
//and return the list of suggestedUsers
const getSuggestedUsers = async (req, res) => {
  try {
    //exclude the current user from suggested users array and exclude users that current user is already following
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 5 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete user
//take in a request user id obj, and send a request through mongoose to find one user by that id and delete that user
//else the user doesnt exist or a server error occurred
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  deleteUser,
  getAllUsers,
  getSingleUser,
};
