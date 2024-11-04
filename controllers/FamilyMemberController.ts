import { Router } from "express";
import { Request, Response } from "express";
import { createFamilyMember } from "../data/familyMember/Repository.ts";
import { createPair } from "../data/pair/Repository.ts";
import { updateUser, transferSpouse } from "../data/familyMember/Repository.ts"; // Импортируем transferSpouse
import FamilyMemberModel from "../data/familyMember/Model.ts";

const familyMemberRouter = new Router();

// Create a new user
familyMemberRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, birthday, father, mother, spouseId, isDivorced } = req.body;

    // Create family member
    const newMember = await createFamilyMember({
      name,
      birthday,
      father,
      mother,
    });

    if (spouseId && isDivorced !== undefined) {
      const newSpouse = await createPair({
        spouse1: spouseId,
        spouse2: newMember._id.toHexString(),
        isDivorced,
      });
      return res.status(201).json({ member: newMember, spouse: newSpouse });
    }

    res.status(201).json({ member: newMember });
  } catch (error) {
    res.status(400).json({ message: "Error creating family member", error });
  }
});

// Update an existing user or transfer a spouse
familyMemberRouter.put("/:id", async (req: Request, res: Response) => {
  console.log("Received data:", req.body); // Логируем входящие данные
  try {
    const { id } = req.params;
    const {
      name,
      birthday,
      father,
      mother,
      spouseId,
      isDivorced,
      currentSpouseId,
      newSpouseId,
    } = req.body;

    // Проверяем наличие ID
    console.log("Updating member with ID:", id);

    // Если указаны currentSpouseId и newSpouseId, переносим супруга
    if (currentSpouseId && newSpouseId) {
      await transferSpouse(currentSpouseId, newSpouseId);
    }

    // Обновляем данные члена семьи
    const updatedMember = await updateUser(id, {
      name,
      birthday,
      father,
      mother,
      spouseId,
      isDivorced,
    });

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ member: updatedMember });
  } catch (error) {
    console.error("Error updating family member:", error);
    res.status(400).json({ message: "Error updating family member", error });
  }
});

// Get all users
familyMemberRouter.get("/", async (req: Request, res: Response) => {
  try {
    const allMembers = await FamilyMemberModel.find(); // Find all users
    res.json(allMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Get a user by ID
familyMemberRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;

    const member = await FamilyMemberModel.findById(memberId); // Find user by ID

    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

export default familyMemberRouter;
