import { ComponentChildren, createContext, JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import * as v from "@valibot/valibot";
import { MessageVariantsScheme } from "../message-types.ts";

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
