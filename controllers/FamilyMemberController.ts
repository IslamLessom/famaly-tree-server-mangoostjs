import { Router, Request, Response } from "express";
import formidable from "npm:formidable";
import { createFamilyMember } from "../data/familyMember/Repository.ts";
import { createPair } from "../data/pair/Repository.ts";
import { updateUser, transferSpouse } from "../data/familyMember/Repository.ts";
import minioClient from "../minioClient.ts";
import FamilyMemberModel from "../data/familyMember/Model.ts";

const familyMemberRouter = new Router();

// Настройка formidable
const form = formidable({
  multiples: true,
  keepExtensions: true, // Сохранять расширения файлов
});

familyMemberRouter.post("/", async (req: Request, res: Response) => {
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Ошибка при разборе формы", error: err });
    }

    // Извлекаем значения из массивов
    const name = fields.name[0];
    const birthday = fields.birthday[0];
    const dateOfDeath = fields.dateOfDeath[0] || null; // Если нет значения, устанавливаем null
    const mother = fields.mother[0] || null;
    const father = fields.father[0] || null;
    const spouseId = fields.spouseId[0] === "null" ? null : fields.spouseId[0]; // Преобразуем строку "null" в null
    const isDivorced = fields.isDivorced[0] === "true"; // Преобразуем строку "false"/"true" в булевый тип

    try {
      let photoUrl = null;

      if (files.photo && files.photo[0]) {
        const file = files.photo[0];
        const fileName = `${Date.now()}-${file.originalFilename}`;

        await minioClient.fPutObject("famaly-tree", fileName, file.filepath);

        photoUrl = `http://localhost:9000/famaly-tree/${fileName}`; // Формируем URL для доступа к загруженному объекту
      }

      // Используем createFamilyMember для сохранения нового члена семьи
      const newMember = await createFamilyMember({
        name,
        birthday: new Date(birthday), // Преобразуем в объект Date
        dateOfDeath: dateOfDeath ? new Date(dateOfDeath) : undefined, // Преобразуем в объект Date или оставляем undefined
        father,
        mother,
        spouseId,
        photoUrl, // Передаем photoUrl
      });

      if (spouseId && isDivorced !== undefined) {
        const newSpouse = await createPair({
          spouse1: spouseId,
          spouse2: newMember._id.toHexString(),
          isDivorced,
        });
        return res.status(201).json({ member: newMember, spouse: newSpouse });
      }

      res.status(201).json({ member: newMember }); // Убедитесь, что member возвращает все поля
    } catch (error) {
      console.error("Ошибка при создании члена семьи:", error);
      res
        .status(400)
        .json({ message: "Ошибка при создании члена семьи", error });
    }
  });
});

familyMemberRouter.put("/:id", async (req: Request, res: Response) => {
  console.log("Received data:", req.body);
  try {
    const { id } = req.params;
    const {
      name,
      birthday,
      dateOfDeath,
      father,
      mother,
      spouseId,
      isDivorced,
      currentSpouseId,
      newSpouseId,
    } = req.body;

    console.log("Updating member with ID:", id);

    if (currentSpouseId && newSpouseId) {
      await transferSpouse(currentSpouseId, newSpouseId);
    }

    const updatedMember = await updateUser(id, {
      name,
      birthday,
      dateOfDeath,
      father,
      mother,
      spouseId,
      isDivorced,
    });

    if (!updatedMember) {
      return res.status(404).json({ message: "Член семьи не найден" });
    }

    res.status(200).json({ member: updatedMember });
  } catch (error) {
    console.error("Ошибка при обновлении члена семьи:", error);
    res
      .status(400)
      .json({ message: "Ошибка при обновлении члена семьи", error });
  }
});

// Получение всех пользователей
familyMemberRouter.get("/", async (req: Request, res: Response) => {
  try {
    const allMembers = await FamilyMemberModel.find();
    res.json(allMembers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении пользователей", error });
  }
});

// Получение пользователя по ID
familyMemberRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;

    const member = await FamilyMemberModel.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(member);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении пользователя", error });
  }
});

export default familyMemberRouter;
