// family-tree-server-mangoos/minioClient.ts
import { Client } from "npm:minio"; // Импортируем minio через npm

const minioClient = new Client({
  endPoint: "localhost", // Укажите адрес вашего сервера MinIO
  port: 9000,
  useSSL: false,
  accessKey: "123456789", // Ваш ключ доступа
  secretKey: "123456789", // Ваш секретный ключ
});

export default minioClient;
