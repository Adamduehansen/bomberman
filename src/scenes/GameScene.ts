import { Engine, Keys, randomInRange, Scene, Timer } from "excalibur";
import map from "../Map.ts";
import Player from "../objects/Player.ts";

export default class GameScene extends Scene {
  onInitialize(engine: Engine): void {
    const spawnPoints = map.tiledMap.getObjectsByClassName("spawn-point");
    const spawnPointIndex = Math.floor(randomInRange(0, spawnPoints.length));

    const player1SpawnPoint = spawnPoints[spawnPointIndex];
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
    engine.add(player1);

    map.tiledMap.addToScene(this);

    engine.currentScene.camera.x = 336 / 2;
    engine.currentScene.camera.y = 208 / 2;
    engine.currentScene.camera.zoom = 3;

    const countdownTimer = new Timer({
      interval: 1000,
      repeats: true,
      fcn: () => {
        console.log("Counting down to the end!");
      },
    });
    countdownTimer.start();
    engine.addTimer(countdownTimer);
  }
}
