import { useEffect } from "preact/hooks";
import { JSX } from "preact";
import { initGame } from "../game/game.ts";

export default function GameDisplay(): JSX.Element {
  useEffect(() => {
    initGame();
  }, []);
  return <canvas id="root"></canvas>;
}
