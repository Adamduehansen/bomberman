import * as ex from "excalibur";
import { Resources } from "../resources.ts";
import { AnimationsComponent } from "../components/animations.ts";

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

const spritesheet = ex.SpriteSheet.fromImageSource({
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
  #animations = new AnimationsComponent({
    idle: spritesheet.getSprite(4, 0),
    left: ex.Animation.fromSpriteSheet(
      spritesheet,
      ex.range(0, 2),
      100,
      ex.AnimationStrategy.PingPong,
    ),
    right: ex.Animation.fromSpriteSheet(
      spritesheet,
      ex.range(7, 9),
      100,
      ex.AnimationStrategy.PingPong,
    ),
    up: ex.Animation.fromSpriteSheet(
      spritesheet,
      ex.range(10, 12),
      100,
      ex.AnimationStrategy.PingPong,
    ),
    down: ex.Animation.fromSpriteSheet(
      spritesheet,
      ex.range(3, 5), // Adjust these indices if your spritesheet layout differs
      100,
      ex.AnimationStrategy.PingPong,
    ),
  });

  constructor(args: Args) {
    super({
      name: args.name,
      pos: args.pos,
      collisionType: ex.CollisionType.Active,
      collider: ex.Shape.Box(16, 16),
    });

    this.addComponent(this.#controls);
    this.addComponent(this.#animations);
  }

  override onInitialize(_engine: ex.Engine): void {
    this.#animations.set("idle");
  }

  override onPreUpdate(_engine: ex.Engine, _elapsed: number): void {
    if (this.#controls.isHeld("right")) {
      this.vel.x = PLAYER_SPEED;
      this.#animations.set("right");
      this.events.emit("c_moving");
    } else if (this.#controls.isHeld("left")) {
      this.vel.x = -PLAYER_SPEED;
      this.#animations.set("left");
      this.events.emit("c_moving");
    } else {
      this.vel.x = 0;
    }
    if (this.#controls.isHeld("up")) {
      this.vel.y = -PLAYER_SPEED;
      this.#animations.set("up");
      this.events.emit("c_moving");
    } else if (this.#controls.isHeld("down")) {
      this.vel.y = PLAYER_SPEED;
      this.#animations.set("down");
      this.events.emit("c_moving");
    } else {
      this.vel.y = 0;
    }

    if (this.vel.x === 0 && this.vel.y === 0) {
      this.#animations.set("idle");
    }

    if (this.#controls.wasPressed("bomb")) {
      this.scene?.emit("c_spawnbomb", this.pos);
    }
  }
}
