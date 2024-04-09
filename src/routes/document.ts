import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { getDocuments, renameDocument } from "../controllers/document.js";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getDocuments)
  .put(authenticate, renameDocument);

export default router;
