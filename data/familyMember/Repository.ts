import FamilyMemberModel from "./Model.ts";
import PairModel from "../pair/Model.ts";

export const createFamilyMember = async (data: {
  name: string;
  birthday: string;
  dateOfDeath?: string;
  father?: string;
  mother?: string;
  spouseId?: string;
  photoUrl?: null | undefined | string; // Добавлено поле для URL фотографии
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
  dateOfDeath?: Date;
  isDivorced?: string;

  spouseId?: string | null | undefined;
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

    if (!existingMember) {
      throw new Error("Пользователь не найден");
    }

    await removeOldSpouseRelationships(userId);

    const updatedMember = await FamilyMemberModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedMember) {
      throw new Error("Не удалось обновить пользователя");
    }

    return updatedMember; // Возвращаем обновленного члена семьи
  } catch (error: any) {
    console.error("Ошибка при обновлении пользователя:", error);
    throw new Error(`Ошибка при обновлении пользователя: ${error.message}`);
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
