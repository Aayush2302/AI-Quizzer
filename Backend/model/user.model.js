import mongoose from 'mongoose';

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
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    quizResults: [
      {
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, // Referencing Quiz's _id
        score: { type: Number },
        percentage: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
