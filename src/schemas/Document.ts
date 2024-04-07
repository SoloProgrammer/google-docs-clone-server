import { Schema, model } from "mongoose";

const DocumentSchema = new Schema(
  {
    _id: String,
    data: Object,
    author: {
      type: Schema.ObjectId,
      require: true,
      ref: "users",
    },
    collaborators: [
      {
        type: Schema.ObjectId,
        ref: "users",
      },
    ],
    title: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Document = model("Document", DocumentSchema);
