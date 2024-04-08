import { Document, Schema, model } from "mongoose";

export type UserType = {
  name: string;
  email: string;
  googleId: string;
  avatar: string;
  createdAt: string;
  udpatedAt: string;
  id?: string;
};

export type UserDocument = Document & UserType;

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
