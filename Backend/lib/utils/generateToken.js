import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (user, res) => {
  const token = jwt.sign(
    {
      userId: user._id, // Include userId in the payload
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  // Set the token in the cookie
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "Strict",
  });
};

export default generateTokenAndSetCookie;
