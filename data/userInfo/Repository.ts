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
  async getUserById(userId: string) {
    // Убедитесь, что тип соответствует
    try {
      // Если userId - это ObjectId, используйте его напрямую
      return await UserModel.findById(userId); // Если вы используете _id
    } catch (error: any) {
      throw new Error("Ошибка при получении пользователя: " + error.message);
    }
  }

  // Обновление информации о пользователе
  async updateUser(userId: string, updatedData: any) {
    try {
      return await UserModel.findByIdAndUpdate(userId, updatedData, {
        new: true,
      }); // Если вы используете _id
    } catch (error: any) {
      throw new Error("Ошибка при обновлении пользователя: " + error.message);
    }
  }
}

export default new UserRepository();
