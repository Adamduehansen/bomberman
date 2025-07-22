import * as ex from "excalibur";
import { Resources } from "../resources.ts";

class ControlsComponent extends ex.Component {
  declare owner: ex.Actor;

  readonly controlSchema = {
    up: [ex.Keys.W, ex.Keys.Up],
    right: [ex.Keys.D, ex.Keys.Right],
    down: [ex.Keys.S, ex.Keys.Down],
    left: [ex.Keys.A, ex.Keys.Left],
    bomb: [ex.Keys.Space, ex.Keys.Enter],
  } as const;

  isHeld(control: keyof typeof this.controlSchema): boolean {
    const engine = this.owner?.scene?.engine;
    if (engine === undefined) {
      return false;
    }

    return engine.input.keyboard.isHeld(this.controlSchema[control][0]) ||
      engine.input.keyboard.isHeld(this.controlSchema[control][1]);
  }

  wasPressed(control: keyof typeof this.controlSchema): boolean {
    const engine = this.owner?.scene?.engine;
    if (engine === undefined) {
      return false;
    }

    return engine.input.keyboard.wasPressed(this.controlSchema[control][0]);
  }
}

const PLAYER_SPEED = 100;

interface Args {
  pos: ex.Vector;
  name: string;
}

const playerSpritesheet = ex.SpriteSheet.fromImageSource({
  image: Resources.img.player,
  grid: {
    columns: 7,
    rows: 3,
    spriteHeight: 16,
    spriteWidth: 16,
  },
});

export class Bomberman extends ex.Actor {
  #controls = new ControlsComponent();

  constructor(args: Args) {
    super({
      name: args.name,
      pos: args.pos,
      color: ex.Color.Green,
      width: 25,
      height: 25,
      collisionType: ex.CollisionType.Active,
    });

    this.addComponent(this.#controls);
  }

  override onInitialize(_engine: ex.Engine): void {
  }

  override onPreUpdate(_engine: ex.Engine, _elapsed: number): void {
    if (this.#controls.isHeld("right")) {
      this.vel.x = PLAYER_SPEED;
      this.events.emit("moving");
    } else if (this.#controls.isHeld("left")) {
      this.vel.x = -PLAYER_SPEED;
      this.events.emit("moving");
    } else {
      this.vel.x = 0;
    }
    if (this.#controls.isHeld("up")) {
      this.vel.y = -PLAYER_SPEED;
      this.events.emit("moving");
    } else if (this.#controls.isHeld("down")) {
      this.vel.y = PLAYER_SPEED;
      this.events.emit("moving");
    } else {
      this.vel.y = 0;
    }

    if (this.#controls.wasPressed("bomb")) {
      this.scene?.emit("c_spawnbomb", this.pos);
    }
  }
}
