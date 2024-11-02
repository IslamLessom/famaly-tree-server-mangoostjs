import mongoose from "mongoose";
import MongoModels from "../MongoModels.ts";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  birthday: { type: String, required: true },
  father: { type: String },
  mother: { type: String },
});

const FamilyMemberModel = mongoose.model(MongoModels.FAMILY_MEMBER, schema);

export default FamilyMemberModel;
