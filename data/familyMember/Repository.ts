import { Request, Response } from "express"; // Using Express for request and response types
import FamilyMemberModel from "./Model.ts";
import PairModel from "../pair/Model.ts";

export const createFamilyMember = async (data: {
  name: string;
  birthday: string;
  father?: string;
  mother?: string;
  spouseId?: string;
  isDivorced?: boolean;
}) => {
  const newMember = new FamilyMemberModel(data);
  await newMember.save();
  return newMember;
};

interface FamilyMemberUpdateType {
  name?: string;
  mother?: string;
  father?: string;
  birthday?: Date;
  spouseId?: string | null | undefined;
  isDivorced?: boolean;
}

interface SpouseUpdateType {
  spouse1?: string;
  spouse2?: string;
  isDivorced?: boolean;
}

const removeOldSpouseRelationships = async (userId: string) => {
  await PairModel.deleteMany({
    $or: [{ spouse1: userId }, { spouse2: userId }],
  });
};

export const updateUser = async (
  userId: string,
  updateData: FamilyMemberUpdateType
) => {
  try {
    const existingMember = await FamilyMemberModel.findById(userId);
    if (updateData.spouseId === "") {
      updateData.spouseId = null; // Set to null if empty string
    }
    if (!existingMember) {
      throw new Error("User not found");
    }

    // Удаляем старые связи перед обновлением
    await removeOldSpouseRelationships(userId);

    // Обновляем данные пользователя
    const updatedMember = await FamilyMemberModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedMember) {
      throw new Error("Failed to update user");
    }

    let updatedSpouse = null;

    // Проверяем наличие spouseId для обновления или создания записи о супруге
    if (updateData.spouseId) {
      console.log(
        "Creating new spouse relationship with ID:",
        updateData.spouseId
      );

      // Создаем новую связь между текущим пользователем и новым супругом
      updatedSpouse = await PairModel.create({
        spouse1: userId,
        spouse2: updateData.spouseId,
        isDivorced: updateData.isDivorced || false,
      });

      console.log("Created new spouse relationship:", updatedSpouse);
    }

    return { updatedMember, updatedSpouse };
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error(`Error updating user: ${error.message}`);
  }
};

// Функция для переноса супруга
export const transferSpouse = async (
  currentSpouseId: string, // ID текущего супруга (например, user4)
  newSpouseId: string // ID нового супруга (например, user2)
) => {
  try {
    // Находим текущую связь для currentSpouseId
    const existingRelationship = await PairModel.findOne({
      $or: [{ spouse1: currentSpouseId }, { spouse2: currentSpouseId }],
    });

    if (!existingRelationship) {
      throw new Error("Current spouse relationship not found");
    }

    // Удаляем старую связь с текущим супругом
    await PairModel.deleteMany({
      _id: existingRelationship._id,
    });

    // Создаем новую связь между currentSpouseId и newSpouseId
    const newRelationship = await PairModel.create({
      spouse1: currentSpouseId,
      spouse2: newSpouseId,
      isDivorced: false, // Устанавливаем статус развода, если необходимо
    });

    console.log("Transferred spouse relationship:", newRelationship);

    return newRelationship; // Возвращаем новую связь
  } catch (error: any) {
    console.error("Error transferring spouse:", error);
    throw new Error(`Error transferring spouse: ${error.message}`);
  }
};
