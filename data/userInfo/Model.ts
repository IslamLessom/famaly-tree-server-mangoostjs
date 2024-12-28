import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String },
  country: { type: String },
  birthday: { type: Date },
  website: { type: String },
  comment: { type: String },
  position: { type: String },
  hobby: { type: String },
  achievements: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
});

const UserModel = mongoose.model("UserInfo", userSchema);

export default UserModel;
