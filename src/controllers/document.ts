import { Document } from "../schemas/Document.js";
import { TryCatch } from "../middlewares/ErrorHandler.js";

export const getDocuments = TryCatch(async (req, res) => {
  const user = req.user;

  const { filterby } = req.query;

  const FIELDS_TO_POPULATE = ["name", "email", "avatar"].join(" ");

  const FILTER_OPTIONS = ["Owned by anyone", "Owned by me", "Not owned by me"];

  let query;

  switch (filterby) {
    case FILTER_OPTIONS[0]:
      query = {
        $or: [{ author: user?.id }, { collaborators: { $in: [user?.id] } }],
      };
      break;
    case FILTER_OPTIONS[1]:
      query = {
        $or: [{ author: user?.id }],
      };
      break;
    case FILTER_OPTIONS[2]:
      query = {
        $and: [
          { author: { $ne: user?.id } },
          { collaborators: { $in: [user?.id] } },
        ],
      };
      break;
    default:
      query = {};
      break;
  }

  const documents = await Document.find(query)
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

export const renameDocument = TryCatch(async (req, res) => {
  const { title, documentId } = req.query;
  await Document.updateOne(
    { _id: documentId },
    {
      $set: { title },
    }
  );

  res.json({ success: true });
});
