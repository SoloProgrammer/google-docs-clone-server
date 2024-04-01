import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectToDB = () => {
  connect(process.env.MONGO_URI as string)
    .then(() => {
      console.log("Connected to mongoDB successfully");
    })
    .catch((err) => {
      console.log("Error while connecting with database", err);
    });
};
