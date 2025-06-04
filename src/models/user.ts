import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    // required: true,
  },
  name: {
    type: String,
    require: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    // unique: true,
    // lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    // enum: ["User", "Admin"],
  },

});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
