import {
  InitPlayerForPlayersData,
  ObsoleteConnectionData,
  PlayerSetPosition,
  ServerMessageVariantsScheme,
} from "../message-types.ts";
import { define } from "../utils.ts";
import * as v from "@valibot/valibot";

interface Player {
  socket: WebSocket;
  pos: {
    x: number;
    y: number;
  };
}

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
  });

  ws.addEventListener("message", ({ data }) => {
    console.log("Socket message received:", data);
    const { success, output, issues } = v.safeParse(
      ServerMessageVariantsScheme,
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
          playerId: output.socketId,
        };
        for (const socket of socketMap.values()) {
          socket.send(JSON.stringify(data));
        }
        break;
      }
      case "PLAYER_POSITION": {
        const { playerId, pos } = output;
        for (const [id, socket] of socketMap.entries()) {
          if (id === playerId) {
            continue;
          }

          const data: PlayerSetPosition = {
            type: "PLAYER_SET_POSITION",
            playerId: playerId,
            pos: pos,
          };

          socket.send(JSON.stringify(data));
        }
        break;
      }
      case "INIT_PLAYER": {
        for (const [id, socket] of socketMap.entries()) {
          if (id === output.socketId) {
            continue;
          }
          const data: InitPlayerForPlayersData = {
            type: "INIT_PLAYERS_FOR_PLAYER",
            player: {
              playerId: output.socketId,
              x: output.pos.x,
              y: output.pos.y,
            },
          };
          socket.send(JSON.stringify(data));
        }
        break;
      }
    }
  });

  ws.addEventListener("error", (event) => {
    console.log("Socket error:", event);
  });

  ws.addEventListener("close", () => {
    console.log("Connection closed!");
  });

  return response;
});
