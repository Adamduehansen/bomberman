import * as ex from "excalibur";
import map from "../Map.ts";
import Player from "../objects/Player.ts";

export default class GameScene extends ex.Scene {
  player?: Player;

  override onActivate(): void {
    const spawnPoints = map.tiledMap.getObjectsByClassName("spawn-point");
    const spawnPointIndex = Math.floor(ex.randomInRange(0, spawnPoints.length));
    const playerSpawnPoint = spawnPoints[spawnPointIndex];

    this.player = new Player({
      x: playerSpawnPoint.x,
      y: playerSpawnPoint.y,
      controls: {
        up: ex.Keys.W,
        right: ex.Keys.D,
        down: ex.Keys.S,
        left: ex.Keys.A,
        placeBomb: ex.Keys.Space,
      },
    });
    this.engine.add(this.player);
    this.camera.pos = this.player.pos;
    this.camera.strategy.lockToActor(this.player);
    this.camera.zoom = 4;

    map.tiledMap.addToScene(this);
  }
}
