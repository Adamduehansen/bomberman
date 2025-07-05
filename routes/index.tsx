import { useSignal } from "@preact/signals";
import { define } from "../utils.ts";
import SocketProvider from "../islands/socket-provider.tsx";

export default define.page(function Home() {
  const userId = useSignal<string>();
  return (
    <SocketProvider>
      Hello, Bomberman!
    </SocketProvider>
  );
});
