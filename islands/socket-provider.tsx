import { ComponentChildren, createContext, JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

interface SocketDataProps {
  id: string | undefined;
  otherPlayers: unknown[];
}

export const SocketData = createContext<SocketDataProps>({
  id: undefined,
  otherPlayers: [],
});

interface Props {
  children: ComponentChildren;
}

export default function SocketProvider({ children }: Props): JSX.Element {
  const socketId = useSignal<string>();
  const otherPlayers = useSignal<unknown[]>([]);

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
          otherPlayers.value = data.otherPlayers;
          break;
        }
        case "NEW_CONNECTION": {
          otherPlayers.value = [...otherPlayers.value, {
            id: data.playerData.id,
          }];
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
      <SocketData.Provider
        value={{
          id: socketId.value,
          otherPlayers: otherPlayers.value,
        }}
      >
        {children}
      </SocketData.Provider>
    </div>
  );
}
