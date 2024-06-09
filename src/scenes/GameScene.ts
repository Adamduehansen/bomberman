import { Engine, Keys, Scene } from "excalibur";
import map from "../Map.ts";
import Player from "../objects/Player.ts";
import BalloonEnemy from "../objects/BalloonEnemy.ts";

export default class GameScene extends Scene {
  onInitialize(engine: Engine): void {
    const spawnPoints = map.tiledMap.getObjectsByClassName("spawn-point");
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
    engine.add(player1);

    const balloonEnemy1 = new BalloonEnemy({
      x: 24,
      y: 88,
    });
    engine.add(balloonEnemy1);

    const balloonEnemy2 = new BalloonEnemy({
      x: 88,
      y: 24,
    });
    engine.add(balloonEnemy2);

    // const player2SpawnPoint = spawnPoints[1];
    // const player2 = new Player({
    //   x: player2SpawnPoint.x,
    //   y: player2SpawnPoint.y,
    //   controls: {
    //     up: Keys.Up,
    //     right: Keys.Right,
    //     down: Keys.Down,
    //     left: Keys.Left,
    //     placeBomb: Keys.Enter,
    //   },
    // });
    // engine.add(player2);

    map.tiledMap.addToScene(this);

    engine.currentScene.camera.x = 336 / 2;
    engine.currentScene.camera.y = 208 / 2;
    engine.currentScene.camera.zoom = 3;
  }
}
