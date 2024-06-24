import { useEffect } from "preact/hooks";
import { DisplayMode, Engine } from "excalibur";
import GameScene from "../game/scenes/GameScene.ts";
import GameOverScene from "../game/scenes/GameOverScene.ts";
import { loader } from "../game/resources.ts";

export function Game() {
  useEffect(() => {
    const game = new Engine({
      suppressPlayButton: true,
      pixelArt: true,
      width: 336,
      height: 208,
      displayMode: DisplayMode.FillScreen,
      maxFps: 60,
    });

    game.addScene("gamescene", new GameScene());
    game.addScene("gameoverscene", new GameOverScene());

    game.start(loader).then(() => {
      game.goToScene("gamescene");
    });
  }, []);

  return <div></div>;
}
