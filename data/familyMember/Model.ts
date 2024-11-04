import mongoose from "mongoose";
import MongoModels from "../MongoModels.ts";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  birthday: { type: Date, required: true }, // Измените на Date для корректного хранения
  father: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MongoModels.FAMILY_MEMBER,
  },
  mother: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MongoModels.FAMILY_MEMBER,
  },
  spouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MongoModels.FAMILY_MEMBER, // Ссылка на модель FamilyMember
  },
});

const FamilyMemberModel = mongoose.model(MongoModels.FAMILY_MEMBER, schema);

export default FamilyMemberModel;
