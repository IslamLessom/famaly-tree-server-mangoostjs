import mongoose from "mongoose"; // Import Mongoose
import { Schema } from "mongoose";

// Define the spouse schema
const spouseSchema = new mongoose.Schema({
  spouse1: { type: Schema.Types.ObjectId, required: true },
  spouse2: { type: String, required: true },
  isDivorced: { type: Boolean, required: true }, // Changed to Boolean for better representation
});

// Create the spouse model
const Spouse = mongoose.model("Spouse", spouseSchema);

// Function to create a spouse
export const createSpouse = async (data: {
  spouse1: any;
  spouse2: any;
  isDivorced: any;
}) => {
  const newSpouse = new Spouse(data);
  await newSpouse.save(); // Save new spouse to database
  return newSpouse; // Return the created spouse
};

export const getAllSpouses = async () => {
  try {
    const allSpouses = await Spouse.find(); // Find all spouses
    return allSpouses; // Return the list of spouses
  } catch (error: any) {
    throw new Error("Error fetching spouses: " + error.message); // Handle errors appropriately
  }
};
