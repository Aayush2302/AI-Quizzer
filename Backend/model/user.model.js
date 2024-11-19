import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate emails
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
      },
    
    },
    { timestamps: true }
  );
  
  const User = mongoose.model("User", userSchema);
  
  export default User;