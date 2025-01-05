import mongoose from "mongoose";
import MongoModels from "../MongoModels.ts";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  birthday: { type: Date, required: true },
  dateOfDeath: { type: Date, required: false },
  father: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MongoModels.FAMILY_MEMBER,
    required: false,
  },
  mother: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MongoModels.FAMILY_MEMBER,
    default: null,
    required: false,
  },
  spouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MongoModels.FAMILY_MEMBER,
    default: null,
    required: false,
  },
  photoUrl: { type: String, required: false }, // Поле для URL фотографии
});

const FamilyMemberModel = mongoose.model(MongoModels.FAMILY_MEMBER, schema);

export default FamilyMemberModel;
