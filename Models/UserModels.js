const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    pwd: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: String,
      default: Date.now,
    },
    isverify: {
      type: Boolean,
      default: false,
    },
    resetpwdToken: String,
    resetpwdExpireAt: Date,
    verifyToken: String,
    verifyTokenexpiredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
