import * as ex from "excalibur";
import { loader } from "./resources.ts";
import GameScene from "./scenes/GameScene.ts";

const game = new ex.Engine({
  suppressPlayButton: true,
  pixelArt: true,
  width: 336,
  height: 208,
  displayMode: ex.DisplayMode.FillScreen,
  maxFps: 60,
  backgroundColor: ex.Color.Black,
});

game.addScene("gamescene", new GameScene());

game.start(loader).then(() => {
  game.goToScene("gamescene");
});
