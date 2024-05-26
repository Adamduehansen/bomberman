import { Engine, randomInRange } from "excalibur";
import "./style.css";
import { loader, tiledMap } from "./resources.ts";
import Player from "./Player.ts";

const game = new Engine({
  suppressPlayButton: true,
  pixelArt: true,
});

game.start(loader).then(() => {
  tiledMap.addToScene(game.currentScene);
});

game.on("initialize", () => {
  const socket = new WebSocket("ws://localhost:8081");
  socket.addEventListener("open", () => {
    console.log("Connected to socket");
  });

  const spawnPoints = tiledMap.getObjectsByClassName("spawn-point");
  const spawnPointIndex = Math.floor(randomInRange(0, spawnPoints.length));

  const spawnPoint = spawnPoints[spawnPointIndex];
  const player = new Player({
    x: spawnPoint.x,
    y: spawnPoint.y,
  });
  game.add(player);

  game.currentScene.camera.strategy.lockToActor(player);
  game.currentScene.camera.zoom = 4;
});
