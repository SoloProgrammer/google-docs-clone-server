import { Server, Socket } from "socket.io";
import { ServerType } from "../types/types.js";
import { Document } from "../schemas/Document.js";
import { User, UserType } from "../schemas/User.js";

const DEFAULT_VALUE = "";

const collaboratorsByDocument: Record<string, Array<Partial<UserType>>> = {};

export const connectToSocket = (server: ServerType) => {
  // Socket operations
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL?.split(", "),
    },
  });
  io.on("connection", (socket: Socket) => {
    console.log("socket connected", socket.id);
    socket.on("get-document", async (documentId, uId) => {
      const user = await User.findById(uId).select("avatar email name _id");
      if (!collaboratorsByDocument[documentId]) {
        collaboratorsByDocument[documentId] = [user!];
      } else {

        !collaboratorsByDocument[documentId].some((u) => u.id === uId) &&
          collaboratorsByDocument[documentId].push(user!);
      }
      socket.join(documentId);

      // load document from DB and send back to client
      const document = await getOrCreateDocument(documentId, uId);
      socket.emit(
        "load-document",
        document,
        collaboratorsByDocument[documentId]
      );

      socket
        .to(documentId)
        .emit("collaborators", collaboratorsByDocument[documentId]);

      socket.on("send-changes", (changes) => {
        socket.broadcast.to(documentId).emit("receive-changes", changes);
      });

      socket.on("save-changes", (changes) => {
        saveDocument(documentId, changes);
      });

      socket.on("exit-document", (documentId) => {
        collaboratorsByDocument[documentId] = collaboratorsByDocument[
          documentId
        ].filter((u) => u.id !== uId);
        socket
          .to(documentId)
          .emit("collaborators", collaboratorsByDocument[documentId]);
      });
    });
  });
  // DB operations
  async function saveDocument(documentId: string, changes: Object) {
    await Document.findByIdAndUpdate(documentId, { data: changes });
  }

  async function getOrCreateDocument(documentId: string, uId: string) {
    const document = await Document.findById(documentId);
    if (document) {
      const { author } = document;

      if (String(author) !== uId) {
        await Document.updateOne(
          { _id: documentId },
          {
            $push: {
              collaborators: uId,
            },
          }
        );
      }

      return document;
    }

    return Document.create({
      _id: documentId,
      data: DEFAULT_VALUE,
      title:"",
      author: uId,
    });
  }
};
