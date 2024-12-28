import { Router } from "express";
import { Request, Response } from "express";
import UserRepository from "../data/userInfo/Repository.ts"; // Путь к вашему репозиторию

const userRouter = new Router();

// Создание нового пользователя
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    // Создание пользователя
    const newUser = await UserRepository.createUser(userData);
    res.status(201).json({ user: newUser });
  } catch (error: any) {
    res.status(400).json({
      message: "Ошибка при создании пользователя",
      error: error.message,
    });
  }
});

// Получение информации о пользователе по userId
userRouter.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await UserRepository.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(400).json({
      message: "Ошибка при получении данных пользователя",
      error: error.message,
    });
  }
});

// Обновление информации о пользователе
userRouter.put("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const updatedUser = await UserRepository.updateUser(userId, req.body);

    if (!updatedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(updatedUser);
  } catch (error: any) {
    res.status(400).json({
      message: "Ошибка при обновлении информации о пользователе",
      error: error.message,
    });
  }
});

export default userRouter; // Экспортируем router
