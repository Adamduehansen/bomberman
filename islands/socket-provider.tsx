import { ComponentChildren, JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

interface Props {
  children: ComponentChildren;
}

export default function SocketProvider({ children }: Props): JSX.Element {
  const socketId = useSignal<string>();

  useEffect(() => {
    const ws = new WebSocket("/ws");

    ws.addEventListener("open", () => {
      console.log("Socket connection established!");
    });

    ws.addEventListener("message", (event) => {
      console.log("Socket message received:", event.data);
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "CONNECTION_ACCEPTED": {
          socketId.value = data.socketId;
          break;
        }
        default: {
          console.log("Unhandled type", data.type);
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
  }, []);

  return (
    <div>
      <p>Socket ID: {socketId.value}</p>
      {children}
    </div>
  );
}
