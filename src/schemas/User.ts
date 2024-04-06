import { Document, Schema, model } from "mongoose";

export type UserDocument = Document & {
  name: string;
  email: string;
  googleId: string;
  avatar: string;
};

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
    },
    email: String,
    googleId: String,
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("users", UserSchema);
