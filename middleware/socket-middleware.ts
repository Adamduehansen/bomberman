import {
  MessageVariantsScheme,
  ObsoleteConnectionData,
} from "../message-types.ts";
import { define } from "../utils.ts";
import * as v from "@valibot/valibot";

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
    const otherPlayersData = Object.entries(Object.fromEntries(socketMap)).map((
      [id],
    ) => ({
      id: id,
    })).filter(({ id }) => id !== socketId);

    // Send message to connected player...
    const connectionAcceptedData = {
      type: "CONNECTION_ACCEPTED",
      socketId: socketId,
      otherPlayers: otherPlayersData,
    };
    ws.send(JSON.stringify(connectionAcceptedData));

    // Send message to all connected players...
    const newConnectionBroadcast = {
      type: "NEW_CONNECTION",
      playerData: {
        id: socketId,
      },
    };

    for (const [id, socket] of socketMap.entries()) {
      if (id === socketId) {
        continue;
      }
      socket.send(JSON.stringify(newConnectionBroadcast));
    }
  });

  ws.addEventListener("message", ({ data }) => {
    console.log("Socket message received:", data);
    const { success, output, issues } = v.safeParse(
      MessageVariantsScheme,
      JSON.parse(data),
    );

    if (success === false) {
      console.warn("Unhandled type", data);
      console.warn(issues);
      return;
    }

    switch (output.type) {
      case "CONNECTION_CLOSED": {
        socketMap.delete(output.socketId);

        const data: ObsoleteConnectionData = {
          type: "OBSOLETE_CONNECTION",
          socketId: output.socketId,
        };
        for (const socket of socketMap.values()) {
          socket.send(JSON.stringify(data));
        }
      }
    }
  });

  ws.addEventListener("error", (event) => {
    console.log("Socket error:", event);
  });

  ws.addEventListener("close", (event) => {
    console.log("Connection closed!", event);
  });

  return response;
});
