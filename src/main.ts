import { DisplayMode, Engine, randomInRange } from "excalibur";
import "./style.css";
import { loader, tiledMap } from "./resources.ts";
import Player from "./Player.ts";

const game = new Engine({
  suppressPlayButton: true,
  pixelArt: true,
  width: 336,
  height: 208,
  displayMode: DisplayMode.FillScreen,
});

game.start(loader).then(() => {
  tiledMap.addToScene(game.currentScene);
});

game.on("initialize", () => {
  const spawnPoints = tiledMap.getObjectsByClassName("spawn-point");
  const spawnPointIndex = Math.floor(randomInRange(0, spawnPoints.length));

  const spawnPoint = spawnPoints[spawnPointIndex];
  const player = new Player({
    x: spawnPoint.x,
    y: spawnPoint.y,
  });
  game.add(player);

  game.currentScene.camera.x = 336 / 2;
  game.currentScene.camera.y = 208 / 2;
  game.currentScene.camera.zoom = 3;
});
