import { define } from "../utils.ts";
import SocketProvider from "../islands/socket-provider.tsx";
import GameDisplay from "../islands/game-display.tsx";
import SocketInfo from "../islands/socket-info.tsx";

export default define.page(function Home() {
  return (
    <SocketProvider>
      <h1>Bomberman</h1>
      <GameDisplay />
      <SocketInfo />
    </SocketProvider>
  );
});
