import { useEffect } from "preact/hooks";
import * as ex from "excalibur";

async function initGame(): Promise<void> {
  const game = new ex.Engine({
    width: 800,
    height: 600,
  });

  await game.start();
}

export default function GameDisplay(): null {
  useEffect(() => {
    console.log("Game display!");
    initGame();
  }, []);
  return null;
}
