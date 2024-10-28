import mongoose from "mongoose"; // Import Mongoose
import { Schema } from "mongoose";

// Define the spouse schema
const spouseSchema = new mongoose.Schema({
  spouse1: { type: String },
  spouse2: { type: String },
  isDivorced: { type: String }, // Changed to Boolean for better representation
});

// Create the spouse model
const Spouse = mongoose.model("Spouse", spouseSchema);

// Function to create a spouse
export const createSpouse = async (data: {
  spouse1: string;
  spouse2: string;
  isDivorced: string;
}) => {
  const newSpouse = new Spouse(data);
  await newSpouse.save(); // Save new spouse to database
  return newSpouse; // Return the created spouse
};

export const getAllSpouses = async (_: Request, res: Response) => {
  try {
    const allSpouse = await Spouse.find(); // Find all users
    res.json(allSpouse);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const updateSpouse = async ({ spouse1, spouse2, isDivorced }: any) => {
  try {
    const updatedSpouse = await Spouse.findOneAndUpdate(
      { spouse1, spouse2 },
      { isDivorced },
      { new: true, runValidators: true }
    );

    if (!updatedSpouse) {
      throw new Error("Spouse relationship not found");
    }

    return updatedSpouse;
  } catch (error: any) {
    throw new Error(`Error updating spouse: ${error.message}`);
  }
};

export const deleteSpouse = async (spouseId: any) => {
  try {
    const deletedSpouse = await Spouse.findByIdAndDelete(spouseId); // Delete by ID

    if (!deletedSpouse) {
      throw new Error("Spouse not found");
    }

    return deletedSpouse; // Return deleted spouse data if needed
  } catch (error: any) {
    throw new Error(`Error deleting spouse: ${error.message}`);
  }
};
