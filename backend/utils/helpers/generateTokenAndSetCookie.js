//import jwt dependency for user auth
import jwt from "jsonwebtoken";

//var function to create a jwt token and creating a http only cookie for more security, then storing the token in the cookie
const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000, //set to expire in 15 days
    sameSite: "strict", //more secure, mitigates cross site request forgery (csrf)
  });

  return token;
};

export default generateTokenAndSetCookie;
