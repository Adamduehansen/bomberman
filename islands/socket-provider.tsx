import { ComponentChildren, createContext, JSX } from "preact";
// import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

export const Socket = createContext<WebSocket | undefined>(undefined);

interface Props {
  children: ComponentChildren;
}

export default function SocketProvider({ children }: Props): JSX.Element {
  const socket = useSignal<WebSocket>();

  // useEffect(() => {
  //   const ws = new WebSocket("/ws");

  //   ws.addEventListener("open", () => {
  //     console.log("Socket connection established!");
  //   });

  //   ws.addEventListener("error", (event) => {
  //     console.log("Socket error:", event);
  //   });

  //   ws.addEventListener("close", () => {
  //     console.log("Connection closed!");
  //   });

  //   socket.value = ws;
  // }, []);

  return (
    <div>
      <Socket.Provider
        value={socket.value}
      >
        {children}
      </Socket.Provider>
    </div>
  );
}
