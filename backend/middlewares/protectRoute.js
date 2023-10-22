import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

//auth protection route to protect routes that only logged in users should be able to access => we check if a jwt token exists, if not then the user isnt logged in and therefore unauthorized
//then we check token in the jwt cookie then we verify the token and if the token is verified successfully we'll check the user info against the token
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

export default protectRoute;
