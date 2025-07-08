import { define } from "../utils.ts";
import SocketProvider from "../islands/socket-provider.tsx";
import GameDisplay from "../islands/game-display.tsx";
import DebugDisplay from "../islands/debug-display.tsx";

export default define.page(function Home() {
  return (
    <SocketProvider>
      <h1>Bomberman</h1>
      <GameDisplay />
      <DebugDisplay />
    </SocketProvider>
  );
});
