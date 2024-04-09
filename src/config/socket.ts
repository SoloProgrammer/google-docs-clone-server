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
        socket.to(documentId).emit("receive-changes", changes);
      });

      socket.on("saving-changes", () => {
        socket.to(documentId).emit("saving-changes");
      });
      socket.on("save-changes", async (changes) => {
        await saveDocument(documentId, changes);
        // The socket below emits an action within the room but not to the parent socket, which is causing changes. By default, the socket emits actions to other sockets in the room but does not emit the action to itself or the socket making the action. This means that actions are emitted from the client to the server.
        socket.to(documentId).emit("changes-saved");
        // the below socket emits changes in the socket it self
        socket.emit("changes-saved");
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
            $addToSet: {
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
      title: "",
      author: uId,
    });
  }
};
