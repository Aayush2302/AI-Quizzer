import bcrypt from "bcrypt";
import validator from "validator";
import User from "../model/user.model.js";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js"; // Default import

export const signup = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // email-validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // email existence
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // User existence
    const userExisting = await User.findOne({ name });
    if (userExisting) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters" });
    }

    // password hashing
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save new user
    const newUser = new User({ name, email, role, password: hashedPassword });

    if (newUser) {
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup Controller", error);
    res.status(400).json({ message: error.message });
  }
};

//LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Check if the password is correct
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user, res); // Pass the entire user object

    // Respond with user details (excluding password)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//LOGOUT
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
    