import { Server, Socket } from "socket.io";
import { ServerType } from "../types/types.js";
import { Document } from "../schemas/Document.js";

const DEFAULT_VALUE = "";

export const connectToSocket = (server:ServerType) => {
  // Socket operations
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL?.split(", "),
    },
  });
  io.on("connection", (socket: Socket) => {
    console.log("socket connected", socket.id);
    socket.on("get-document", async (documentId) => {
      socket.join(documentId);

      // load document from DB and send back to client
      const document = await getOrCreateDocument(documentId);
      socket.emit("load-document", document.data);

      socket.on("send-changes", (changes) => {
        socket.broadcast.to(documentId).emit("receive-changes", changes);
      });

      socket.on("save-changes", (changes) => {
        saveDocument(documentId, changes);
      });
    });
  });

  // DB operations
  async function saveDocument(documentId: string, changes: Object) {
    await Document.findByIdAndUpdate(documentId, { data: changes });
  }

  async function getOrCreateDocument(documentId: string) {
    const document = await Document.findById(documentId);
    if (document) return document;

    return Document.create({ _id: documentId, data: DEFAULT_VALUE });
  }
};
