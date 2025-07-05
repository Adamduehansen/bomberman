import { JSX } from "preact";
import { useContext } from "preact/hooks";
import { SocketId } from "./socket-provider.tsx";

export default function SocketInfo(): JSX.Element {
  const socketId = useContext(SocketId);
  return (
    <div>
      <p>Socket ID: {socketId}</p>
    </div>
  );
}
