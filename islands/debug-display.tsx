import { ComponentProps, JSX } from "preact";
import { useContext } from "preact/hooks";
import { SocketData } from "./socket-provider.tsx";

interface PlayerListProps {
  players: ComponentProps<typeof SocketData>["value"]["otherPlayers"];
}

function PlayerList({ players }: PlayerListProps): JSX.Element {
  if (players.length > 0) {
    return (
      <ul>
        {players.map((player, index) => {
          return <li key={index}>{player.id}</li>;
        })}
      </ul>
    );
  } else {
    return <p>No other players</p>;
  }
}

export default function DebugDisplay(): JSX.Element {
  const socketData = useContext(SocketData);

  return (
    <div>
      <h2>Socket Info:</h2>
      <h3>Player info</h3>
      <p>Socket ID: {socketData.id}</p>
      <h3>Other Players</h3>
      <PlayerList players={socketData.otherPlayers} />
    </div>
  );
}
