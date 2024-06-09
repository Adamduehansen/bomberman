import { DisplayMode, Engine } from "excalibur";
import "./style.css";
import { loader } from "./resources.ts";
import GameScene from "./GameScene.ts";
import GameOverScene from "./GameOverScene.ts";

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
