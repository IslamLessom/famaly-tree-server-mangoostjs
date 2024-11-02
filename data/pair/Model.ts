import mongoose from "mongoose";
import MongoModels from "../MongoModels.ts";

const spouseSchema = new mongoose.Schema({
  spouse1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MongoModels.FAMILY_MEMBER,
  },
  spouse2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: MongoModels.FAMILY_MEMBER,
  },
  isDivorced: { type: Boolean },
});

const PairModel = mongoose.model(MongoModels.PAIR, spouseSchema);

export default PairModel;
