import { DisplayMode, Engine } from "excalibur";
import "./style.css";
import { loader, tiledMap } from "./resources.ts";
import Player from "./Player.ts";
import { Keys } from "excalibur";

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
  // const spawnPointIndex = Math.floor(randomInRange(0, spawnPoints.length));

  const player1SpawnPoint = spawnPoints[0];
  const player1 = new Player({
    x: player1SpawnPoint.x,
    y: player1SpawnPoint.y,
    controls: {
      up: Keys.W,
      right: Keys.D,
      down: Keys.S,
      left: Keys.A,
      placeBomb: Keys.Space,
    },
  });
  game.add(player1);

  const player2SpawnPoint = spawnPoints[1];
  const player2 = new Player({
    x: player2SpawnPoint.x,
    y: player2SpawnPoint.y,
    controls: {
      up: Keys.Up,
      right: Keys.Right,
      down: Keys.Down,
      left: Keys.Left,
      placeBomb: Keys.Enter,
    },
  });
  game.add(player2);

  game.currentScene.camera.x = 336 / 2;
  game.currentScene.camera.y = 208 / 2;
  game.currentScene.camera.zoom = 3;
});
