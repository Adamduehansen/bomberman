import { Keys, randomInRange, Scene, Timer } from "excalibur";
import map from "../Map.ts";
import Player from "../objects/Player.ts";
import { decreaseTimeLeft, store } from "../store.ts";

export default class GameScene extends Scene {
  #countdownTimer!: Timer;
  player?: Player;

  onActivate(): void {
    const spawnPoints = map.tiledMap.getObjectsByClassName("spawn-point");
    const spawnPointIndex = Math.floor(randomInRange(0, spawnPoints.length));

    const player1SpawnPoint = spawnPoints[spawnPointIndex];
    this.player = new Player({
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
    this.engine.add(this.player);
    this.camera.pos = this.player.pos;
    this.camera.strategy.lockToActor(this.player);
    this.camera.zoom = 4;

    map.tiledMap.addToScene(this);

    this.#countdownTimer = new Timer({
      interval: 1000,
      repeats: true,
      fcn: this.#updateCountdown.bind(this),
    });
    this.engine.addTimer(this.#countdownTimer);

    this.#updateTimerUi();
    this.#updateScoreUi();

    this.#countdownTimer.start();

    store.subscribe(() => {
      this.#updateScoreUi();
    });
  }

  onDeactivate(): void {
    this.player?.kill();
    this.player = undefined;
    this.camera.clearAllStrategies();
  }

  #updateCountdown(): void {
    store.dispatch(decreaseTimeLeft());
    this.#updateTimerUi();
  }

  #updateTimerUi() {
    const { timeLeft } = store.getState().timer;
    document.querySelector(".countdown")!.textContent = `Timer ${timeLeft}`;
  }

  #updateScoreUi() {
    const { score } = store.getState().score;
    document.querySelector(".score")!.textContent = `Score: ${score}`;
  }
}
