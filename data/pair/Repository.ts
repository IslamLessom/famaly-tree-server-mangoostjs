import PairModel from "./Model.ts";
import { Request, Response } from "express";

// Function to create a spouse
export const createPair = async (data: {
  spouse1: string;
  spouse2: string;
  isDivorced: boolean;
}) => {
  const newPair = new PairModel(data);
  await newPair.save(); // Save new spouse to database
  return newPair; // Return the created spouse
};

export const getAllPairs = async (_: Request, res: Response) => {
  try {
    const allPairs = await PairModel.find().lean(); // Find all users
    res.json(allPairs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const updatePair = async ({ spouse1, spouse2, isDivorced }: any) => {
  try {
    const updatedPair = await PairModel.findOneAndUpdate(
      { spouse1, spouse2 },
      { isDivorced },
      { new: true, runValidators: true }
    );

    if (!updatedPair) {
      throw new Error("Pair relationship not found");
    }

    return updatedPair;
  } catch (error: any) {
    throw new Error(`Error updating spouse: ${error.message}`);
  }
};

export const deletePair = async (spouseId: any) => {
  try {
    const deletedPair = await PairModel.findByIdAndDelete(spouseId); // Delete by ID

    if (!deletedPair) {
      throw new Error("Pair not found");
    }

    return deletedPair; // Return deleted spouse data if needed
  } catch (error: any) {
    throw new Error(`Error deleting spouse: ${error.message}`);
  }
};
