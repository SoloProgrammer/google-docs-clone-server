import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { getDocuments } from "../controllers/document.js";

const router = express.Router();

router.get("/", authenticate, getDocuments);

export default router;
