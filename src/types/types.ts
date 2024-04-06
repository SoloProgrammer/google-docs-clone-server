import { IncomingMessage, Server, ServerResponse } from "http";

export type ServerType = Server<typeof IncomingMessage, typeof ServerResponse>;
