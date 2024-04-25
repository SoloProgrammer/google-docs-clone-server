import dotenv from "dotenv";
import { connectToDB } from "./utils/connect.js";
import express, { Request, Response } from "express";
import { connectToSocket } from "./config/socket.js";
import UserRoutes from "./routes/user.js";
import DocumentRoutes from "./routes/document.js";
import { ErrorHandler } from "./middlewares/ErrorHandler.js";
import { connectPassport } from "./providers/passport.js";
import expressSession from "express-session";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

connectToDB();
connectPassport();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

const PORT = parseInt(process.env.PORT!);

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.use("/api/auth", UserRoutes);
app.use("/api/documents", DocumentRoutes);

app.use(ErrorHandler);

const server = app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});

connectToSocket(server);
