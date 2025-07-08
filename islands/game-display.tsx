import { useEffect } from "preact/hooks";
import * as ex from "excalibur";
import { JSX } from "preact";

interface PlayerArgs {
  pos: ex.Vector;
}

class ControlsComponent extends ex.Component {
  declare owner: ex.Actor;

  readonly controlSchema = {
    up: [ex.Keys.W, ex.Keys.Up],
    right: [ex.Keys.D, ex.Keys.Right],
    down: [ex.Keys.S, ex.Keys.Down],
    left: [ex.Keys.A, ex.Keys.Left],
  } as const;

  isHeld(control: keyof typeof this.controlSchema): boolean {
    const engine = this.owner?.scene?.engine;
    if (engine === undefined) {
      return false;
    }

    return engine.input.keyboard.isHeld(this.controlSchema[control][0]) ||
      engine.input.keyboard.isHeld(this.controlSchema[control][1]);
  }
}

const PLAYER_SPEED = 100;

class Player extends ex.Actor {
  #controls = new ControlsComponent();

  constructor(args: PlayerArgs) {
    super({
      pos: args.pos,
      color: ex.Color.Red,
      width: 25,
      height: 25,
    });

    this.addComponent(this.#controls);
  }

  override onPreUpdate(_engine: ex.Engine, _elapsed: number): void {
    if (this.#controls.isHeld("right")) {
      this.vel.x = PLAYER_SPEED;
    } else if (this.#controls.isHeld("left")) {
      this.vel.x = -PLAYER_SPEED;
    } else {
      this.vel.x = 0;
    }
    if (this.#controls.isHeld("up")) {
      this.vel.y = -PLAYER_SPEED;
    } else if (this.#controls.isHeld("down")) {
      this.vel.y = PLAYER_SPEED;
    } else {
      this.vel.y = 0;
    }
  }
}

async function initGame(): Promise<void> {
  const game = new ex.Engine({
    width: 800,
    height: 600,
    canvasElementId: "root",
  });

  const player = new Player({
    pos: ex.vec(100, 100),
  });

  game.add(player);

  await game.start();
}

export default function GameDisplay(): JSX.Element {
  useEffect(() => {
    initGame();
  }, []);
  return <canvas id="root"></canvas>;
}
