import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "./controllers/FamilyMember.ts"; // Import controller functions
import { createSpouse } from "./controllers/Spouse.ts";

const router = new Router();

// Create a new user and optionally a spouse
router.post("/create-tree", async (req, res) => {
  try {
    const { name, birthday, father, mother, spouseId, isDivorced } = req.body;

    // Create family member
    const newMember = await createUser({ name, birthday, father, mother });

    // Create spouse if provided
    if (spouseId && isDivorced !== undefined) {
      const newSpouse = await createSpouse({
        spouse1: newMember._id,
        spouse2: spouseId,
        isDivorced,
      });
      return res.status(201).json({ member: newMember, spouse: newSpouse });
    }

    res.status(201).json({ member: newMember });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating family member or spouse", error });
  }
});

// Get all users
router.get("/tree", getAllUsers);

// Get a user by ID
router.get("/tree/:id", getUserById);

export default router; // Export the router
