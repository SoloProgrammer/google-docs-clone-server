import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import { connectToDB } from "./utils/connect.js";
import { Document } from "./schemas/Document.js";

dotenv.config();

connectToDB();

const PORT = parseInt(process.env.PORT!);
const DEFAULT_VALUE = "";

// Socket operations
const io = new Server(PORT, {
  cors: {
    origin: process.env.CLIENT_URL as string,
  },
});
io.on("connection", (socket: Socket) => {
  console.log("connected", socket.id);
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
