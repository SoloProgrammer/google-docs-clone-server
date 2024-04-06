import dotenv from "dotenv";
import { connectToDB } from "./utils/connect.js";
import express, { Request, Response } from "express";
import { connectToSocket } from "./config/socket.js";
dotenv.config();

connectToDB();

const PORT = parseInt(process.env.PORT!);

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

const server = app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});

connectToSocket(server);
