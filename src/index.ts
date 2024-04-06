import dotenv from "dotenv";
import { connectToDB } from "./utils/connect.js";
import express, { Request, Response } from "express";
import { connectToSocket } from "./config/socket.js";
import UserRoutes from "./routes/user.js";
import { ErrorHandler } from "./middlewares/ErrorHandler.js";
import { connectPassport } from "./providers/auth.js";
import expressSession from "express-session";
import passport from "passport";

dotenv.config();

connectToDB();
connectPassport();
const app = express();

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

const PORT = parseInt(process.env.PORT!);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", UserRoutes);

const server = app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});

connectToSocket(server);

app.use(ErrorHandler);
