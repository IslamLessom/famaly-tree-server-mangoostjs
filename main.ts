import mongoose from "mongoose";
import express from "express";
import bodyParser from "bodyParser";
import cors from "cors";
import familyMemberRouter from "./controllers/FamilyMemberController.ts";
import pairRouter from "./controllers/PairController.ts";

const uri =
  "mongodb+srv://islam:WcHlVCrEiTUb5ERx@family-tree.vs4jz.mongodb.net/family-three?retryWrites=true&w=majority";

try {
  await mongoose.connect(uri); // Connect to MongoDB
  console.log("Connected to MongoDB Atlas");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  Deno.exit(1); // Exit if connection fails
}

const app = express();
app.use(cors());

const PORT = 8000;

app.use(bodyParser.json());
app.use("/tree", familyMemberRouter);
app.use("/pair", pairRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
