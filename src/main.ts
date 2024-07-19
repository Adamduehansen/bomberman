import { Color, DisplayMode, Engine } from "excalibur";
import { loader } from "./resources.ts";
import GameScene from "./scenes/GameScene.ts";
import GameOverScene from "./scenes/GameOverScene.ts";

const game = new Engine({
  suppressPlayButton: true,
  pixelArt: true,
  width: 336,
  height: 208,
  displayMode: DisplayMode.FillScreen,
  maxFps: 60,
  backgroundColor: Color.Black,
});

game.addScene("gamescene", new GameScene());
game.addScene("gameoverscene", new GameOverScene());

game.start(loader).then(() => {
  game.goToScene("gamescene");
});
