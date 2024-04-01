import { Schema, model } from "mongoose";

const DocumentSchema = new Schema({
  _id: String,
  data: Object,
});

export const Document = model("Document", DocumentSchema);
