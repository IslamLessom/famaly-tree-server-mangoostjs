import { Request, Response } from "express"; // Using Express for request and response types
import mongoose from "mongoose"; // Import Mongoose

// Define the family member schema
const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthday: { type: String, required: true },
  father: { type: String },
  mother: { type: String },
});

// Create the family member model
const FamilyMember = mongoose.model("Three", familyMemberSchema);

// Function to create a user (family member)
export const createUser = async (data: {
  name: string;
  birthday: string;
  father?: string;
  mother?: string;
}) => {
  const newMember = new FamilyMember(data); // Create a new instance of FamilyMember with provided data
  await newMember.save(); // Save new user to database
  return newMember; // Return the created member
};

// Function to get all users (family members)
export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const allMembers = await FamilyMember.find(); // Find all users
    res.json(allMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Function to get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;

    const member = await FamilyMember.findById(memberId); // Find user by ID

    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};
