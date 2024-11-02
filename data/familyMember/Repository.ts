import { Request, Response } from "express"; // Using Express for request and response types
import FamilyMemberModel from "../familyMember/Model.ts";
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
  birthDate?: string;
  spouseId?: string;
  isDivorced?: boolean;
}

interface SpouseUpdateType {
  spouse1?: string;
  spouse2?: string;
  isDivorced?: boolean;
}

export const updateUser = async (
  userId: string,
  updateData: FamilyMemberUpdateType
) => {
  try {
    const updatedMember = await FamilyMemberModel.findByIdAndUpdate(
      userId,
      updateData
    );

    if (!updatedMember) {
      throw new Error("User not found");
    }

    if (updateData.spouseId) {
      const spouseUpdateBody: SpouseUpdateType = {
        spouse2: updateData.spouseId,
      };
      if (updateData.isDivorced !== undefined) {
        spouseUpdateBody.isDivorced = updateData.isDivorced;
      }

      const updatedSpouse = await PairModel.findOneAndUpdate(
        { spouse1: userId },
        spouseUpdateBody
      );

      return updatedSpouse;
    }

    return updatedMember;
  } catch (error: any) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};
