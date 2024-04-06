import { UserDocument } from "../../schemas/User.js";

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
