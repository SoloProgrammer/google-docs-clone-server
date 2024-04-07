import { Document } from "../schemas/Document.js";
import { TryCatch } from "../middlewares/ErrorHandler.js";

export const getDocuments = TryCatch(async (req, res) => {
  const user = req.user;

  const FIELDS_TO_POPULATE = ["name", "email", "avatar"].join(" ");
  
  const documents = await Document.find({
    $or: [{ author: user?.id }, { collaborators: { $in: [user?.id] } }],
  })
    .populate({
      path: "author",
      select: FIELDS_TO_POPULATE,
    })
    .populate({
      path: "collaborators",
      select: FIELDS_TO_POPULATE,
    });

  res.status(200).json({ documents });
});
