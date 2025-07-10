import { JSX } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import * as v from "@valibot/valibot";
import { Socket } from "./socket-provider.tsx";
import { MessageVariantsScheme } from "../message-types.ts";

interface PlayerDebugInfo {
  id: string;
}

interface PlayerListProps {
  playerInfo: PlayerDebugInfo[];
}

function PlayerList({ playerInfo }: PlayerListProps): JSX.Element {
  if (playerInfo.length > 0) {
    return (
      <ul>
        {playerInfo.map((playerInfo) => {
          return <li key={playerInfo.id}>{playerInfo.id}</li>;
        })}
      </ul>
    );
  } else {
    return <p>No other players</p>;
  }
}

export default function DebugDisplay(): JSX.Element {
  const socketId = useSignal<string>();
  const otherPlayers = useSignal<PlayerDebugInfo[]>([]);
  const socket = useContext(Socket);

  useEffect(() => {
    if (socket === undefined) {
      return;
    }

    socket.addEventListener("message", ({ data }) => {
      console.log("DEBUG: Socket message received:", data);

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
        case "CONNECTION_ACCEPTED": {
          socketId.value = output.socketId;
          otherPlayers.value = output.otherPlayers;
          break;
        }
        case "NEW_CONNECTION": {
          otherPlayers.value = [...otherPlayers.value, {
            id: output.playerData.id,
          }];
          break;
        }
      }
    });
  }, [socket]);

  return (
    <div>
      <h2>Socket Info:</h2>
      <h3>Player info</h3>
      <p>Socket ID: {socketId}</p>
      <h3>Other Players</h3>
      <PlayerList playerInfo={otherPlayers.value} />
    </div>
  );
}
