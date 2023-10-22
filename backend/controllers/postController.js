import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

//create post
//gets request body info and checks the postedBy and text fields exist
//then finds a user based on postedBy (the user to create a post) -> if no user exists then cannot post
//if user id doesnt match req body id then the user is unauthorized trying to make a new post for someone else
//post params must be (<=) than 500 chars and allows users to use cloudinary to upload pictures
//then saves the post to DB
const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Postedby and text fields are required" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "Page not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

//finds a post by its id then if no post is found in db with the id, then no post exists
//otherwise return the posts info
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//deletes a post by finding it in the db by its id, is no post is found in db then it doesnt exist
//otherwise if postedBy user and user_id != match then another user is trying to delete a post they didnt create
//else delete any images on the post and the post itself in db
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//like or unlike a post by finding the post id
//then getting the user id who wants to like/unlike it
//if no post id exists in db then it doesnt exist
//checks if user has already liked it or not
//if so and the user has sent the http request -> unlike the post
//else user hasn't liked the post already and has sent the http request -> like the post
const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//reply to post by getting req body info and splitting it into their own vars
//checks if text field exists
//checks if post exists in db or not by id -> if not then no post exists
//gets user info that wants to reply to and creates a reply obj
//sends reply obj to the post in db
const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//feed posts for people who follow other users and want to see their posts on the homepage (the feed)
//gets req user id for the user
//checks user exists in db
//gets list of users that the user follows
//gets posts from the following list
//orders the posts by latest / most recent post from the following list
//returns the posts from the following list
const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Page not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get a users posts by getting their username
//check if their username exists in db by just needing to find one because usernames are unique there can only ever be at least 1 in db if user exists
//if no user found, no user exists
//else get users posts and sort in order of latest / most recent post
//return list of posts from user
const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Page not found" });
    }

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
};
