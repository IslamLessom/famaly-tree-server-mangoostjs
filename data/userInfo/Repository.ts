import UserModel from "./Model.ts"; // Путь к вашей модели

class UserRepository {
  // Создание нового пользователя
  async createUser(userData: any) {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (error: any) {
      throw new Error("Ошибка при создании пользователя: " + error.message);
    }
  }

  // Получение пользователя по userId
  async getUserById(userId: any) {
    try {
      return await UserModel.findOne({ userId });
    } catch (error: any) {
      throw new Error("Ошибка при получении пользователя: " + error.message);
    }
  }

  // Обновление информации о пользователе
  async updateUser(userId: any, updatedData: any) {
    try {
      return await UserModel.findOneAndUpdate({ userId }, updatedData, {
        new: true,
      });
    } catch (error: any) {
      throw new Error("Ошибка при обновлении пользователя: " + error.message);
    }
  }
}

export default new UserRepository();
