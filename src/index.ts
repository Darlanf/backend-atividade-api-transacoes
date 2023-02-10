import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { usersRoutes } from "./routes/users.routes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", usersRoutes());

// http://localhost:3333
app.listen(process.env.PORT, () => {
  console.log(
    `API transactions está rodando na porta ${process.env.PORT}!`
  );
});
