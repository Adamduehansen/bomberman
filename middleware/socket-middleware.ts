import { define } from "../utils.ts";

const socketMap = new Map<string, WebSocket>();

export const socket = define.middleware(({ req }) => {
  const upgradeHeader = req.headers.get("upgrade");
  if (upgradeHeader !== "websocket") {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }
  const { socket: ws, response } = Deno.upgradeWebSocket(req);

  ws.addEventListener("open", () => {
    console.log("Connection established!");
    const socketId = crypto.randomUUID();
    console.log("Connection has been assigned", socketId);
    socketMap.set(socketId, ws);
    const socketIdAndData = Object.entries(Object.fromEntries(socketMap)).map((
      [id],
    ) => ({
      id: id,
    })).filter(({ id }) => id !== socketId);

    const connectionAcceptedData = {
      type: "CONNECTION_ACCEPTED",
      socketId: socketId,
      otherPlayers: socketIdAndData,
    };
    ws.send(JSON.stringify(connectionAcceptedData));
  });

  ws.addEventListener("message", ({ data }) => {
    console.log("Socket message received:", data);
  });

  ws.addEventListener("error", (event) => {
    console.log("Socket error:", event);
  });

  ws.addEventListener("close", () => {
    console.log("Connection closed!");
  });

  return response;
});
