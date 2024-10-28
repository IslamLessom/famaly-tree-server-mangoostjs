import { Router } from "express";
import { Request, Response } from "express"; // Using Express for request and response types

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./controllers/FamilyMember.ts"; // Import controller functions
import {
  createSpouse,
  deleteSpouse,
  getAllSpouses,
  updateSpouse,
} from "./controllers/Spouse.ts";

const router = new Router();

// Create a new user
router.post("/create-tree", async (req: Request, res: Response) => {
  try {
    const { name, birthday, father, mother } = req.body;

    // Create family member
    const newMember = await createUser({ name, birthday, father, mother });

    res.status(201).json({ member: newMember });
  } catch (error) {
    res.status(400).json({ message: "Error creating family member", error });
  }
});

// Create a new spouse
router.post("/create-spouse", async (req: Request, res: Response) => {
  try {
    const { spouse1, spouse2, isDivorced } = req.body;

    // Create spouse
    const newSpouse = await createSpouse({
      spouse1,
      spouse2,
      isDivorced,
    });

    res.status(201).json({ spouse: newSpouse });
  } catch (error) {
    res.status(400).json({ message: "Error creating spouse", error });
  }
});

// Edit an existing user and optionally update a spouse
router.put("/create-tree/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameters
    const { name, birthday, father, mother } = req.body;

    // Update family member details
    const updatedMember = await updateUser(id, {
      name,
      birthday,
      father,
      mother,
    });

    res.status(200).json({ member: updatedMember });
  } catch (error) {
    res.status(400).json({ message: "Error updating family member", error });
  }
});

// Get all users
router.get("/tree", getAllUsers);
router.get("/spouses", getAllSpouses);

router.delete("/spouses/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get ID from request parameters
    const deletedSpouse = await deleteSpouse(id); // Call delete function
    res.json({ message: "Spouse deleted successfully", deletedSpouse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a user by ID
router.get("/tree/:id", getUserById);

export default router; // Export the router
