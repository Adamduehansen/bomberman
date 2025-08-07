import * as ex from "excalibur";
import { Bomberman } from "./bomberman.ts";
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

  wasReleased(control: keyof typeof this.controlSchema): boolean {
    const engine = this.owner?.scene?.engine;
    if (engine === undefined) {
      return false;
    }

    return engine.input.keyboard.wasReleased(this.controlSchema[control][0]) ||
      engine.input.keyboard.wasReleased(this.controlSchema[control][1]);
  }
}

interface Args {
  pos: ex.Vector;
}

const PLAYER_SPEED = 100;

export class Player extends Bomberman {
  #dead = false;
  #controls = new ControlsComponent();

  constructor(args: Args) {
    super({
      name: "Player",
      pos: args.pos,
      spriteSheetImageSource: Resources.img.player,
    });
  }

  override onInitialize(engine: ex.Engine): void {
    super.onInitialize(engine);
    this.addComponent(this.#controls);
  }

  override onPreUpdate(_engine: ex.Engine, _elapsed: number): void {
    if (this.#dead) {
      this.vel = ex.Vector.Zero;
      return;
    }

    if (this.#controls.isHeld("right")) {
      this.vel.x = PLAYER_SPEED;
      this.animations.set("right");
      this.events.emit("c_moving", "right");
    } else if (this.#controls.isHeld("left")) {
      this.vel.x = -PLAYER_SPEED;
      this.animations.set("left");
      this.events.emit("c_moving", "left");
    } else {
      this.vel.x = 0;
    }
    if (this.#controls.isHeld("up")) {
      this.vel.y = -PLAYER_SPEED;
      this.animations.set("up");
      this.events.emit("c_moving", "up");
    } else if (this.#controls.isHeld("down")) {
      this.vel.y = PLAYER_SPEED;
      this.animations.set("down");
      this.events.emit("c_moving", "down");
    } else {
      this.vel.y = 0;
    }

    if (
      this.#controls.wasReleased("right") ||
      this.#controls.wasReleased("down") ||
      this.#controls.wasReleased("left") ||
      this.#controls.wasReleased("up")
    ) {
      this.events.emit("c_moving", "idle");
    }

    if (this.vel.x === 0 && this.vel.y === 0) {
      this.animations.set("idle");
    }

    if (this.#controls.wasPressed("bomb")) {
      this.scene?.emit("c_spawnbomb", this.pos);
    }
  }

  override onCollisionStart(
    self: ex.Collider,
    other: ex.Collider,
    side: ex.Side,
    contact: ex.CollisionContact,
  ): void {
    super.onCollisionStart(self, other, side, contact);
    console.log("Player collision!", other.owner.name);
    this.#dead = true;
    this.animations.set("die");
    this.events.emit("c_die");
  }
}
