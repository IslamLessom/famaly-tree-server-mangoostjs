import { Router } from "express";
import { Request, Response } from "express";
import { createPair, deletePair } from "../data/pair/Repository.ts";
import PairModel from "../data/pair/Model.ts";

const pairRouter = new Router();

// Create a new spouse
pairRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { spouse1, spouse2, isDivorced } = req.body;

    // Create spouse
    const newSpouse = await createPair({
      spouse1,
      spouse2,
      isDivorced,
    });

    res.status(201).json({ spouse: newSpouse });
  } catch (error) {
    res.status(400).json({ message: "Error creating spouse", error });
  }
});

pairRouter.get("/", async (req: Request, res: Response) => {
  try {
    const allSpouse = await PairModel.find(); // Find all users
    res.json(allSpouse);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

pairRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Get ID from request parameters
    const deletedSpouse = await deletePair(id); // Call delete function
    res.json({ message: "Pair deleted successfully", deletedSpouse });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default pairRouter; // Export the pairRouter
