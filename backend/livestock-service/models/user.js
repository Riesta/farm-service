const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // kosong jika OAuth
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    oauth: {
      provider: {
        type: String,
        required: false,
      },
      providerId: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
