import mongoose from "mongoose";
import express from "express";
import bodyParser from "bodyParser";
import router from "./routes.ts"; // Importing router

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
const PORT = 8000;

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
