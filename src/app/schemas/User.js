import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    },

    email: {
      type: String,
      require: true,
      lowercase: true,
      unique: true
    },

    password: {
      type: String
    },

    phone: {
      ddd: { type: Number },
      numero: { type: Number }
    },
    last_login: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);
