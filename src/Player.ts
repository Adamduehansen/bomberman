import {
  Actor,
  ActorArgs,
  Animation,
  AnimationStrategy,
  Collider,
  CollisionType,
  Engine,
  Keys,
  range,
  Shape,
} from "excalibur";
import { spriteSheet } from "./resources.ts";
import Bomb from "./Bomb.ts";

interface Controls {
  up: Keys;
  right: Keys;
  down: Keys;
  left: Keys;
  placeBomb: Keys;
}

export default class Player extends Actor {
  #controls: Controls;

  #isKilled: boolean = false;

  constructor(
    { x, y, controls }: Required<Pick<ActorArgs, "x" | "y">> & {
      controls: Controls;
    },
  ) {
    super({
      x: x,
      y: y,
      name: "Player",
      collider: Shape.Circle(8),
      collisionType: CollisionType.Active,
      z: 10,
    });
    this.#controls = controls;
  }

  onInitialize(): void {
    new Animation({
      frames: [{
        graphic: spriteSheet.getSprite(0, 0),
        duration: 100,
      }, {
        graphic: spriteSheet.getSprite(1, 0),
        duration: 100,
      }],
    });
    this.graphics.add("idle", spriteSheet.getSprite(4, 0));
    this.graphics.add(
      "walk-down",
      Animation.fromSpriteSheet(
        spriteSheet,
        range(3, 5),
        100,
        AnimationStrategy.PingPong,
      ),
    );
    this.graphics.add(
      "walk-up",
      Animation.fromSpriteSheet(
        spriteSheet,
        range(19, 21),
        100,
        AnimationStrategy.PingPong,
      ),
    );
    this.graphics.add(
      "walk-left",
      Animation.fromSpriteSheet(
        spriteSheet,
        range(0, 2),
        100,
        AnimationStrategy.PingPong,
      ),
    );
    this.graphics.add(
      "walk-right",
      Animation.fromSpriteSheet(
        spriteSheet,
        range(16, 18),
        100,
        AnimationStrategy.PingPong,
      ),
    );
    const dieAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      range(32, 38),
      100,
      AnimationStrategy.End,
    );
    dieAnimation.events.on("end", () => {
      this.kill();
    });
    this.graphics.add(
      "die",
      dieAnimation,
    );
    this.graphics.use("idle");
  }

  onPreUpdate(engine: Engine): void {
    if (this.#isKilled) {
      return;
    }

    if (engine.input.keyboard.isHeld(this.#controls.down)) {
      this.graphics.use("walk-down");
      this.pos.y += 1;
    }
    if (engine.input.keyboard.isHeld(this.#controls.up)) {
      this.graphics.use("walk-up");
      this.pos.y -= 1;
    }
    if (engine.input.keyboard.isHeld(this.#controls.left)) {
      this.graphics.use("walk-left");
      this.pos.x -= 1;
    }
    if (engine.input.keyboard.isHeld(this.#controls.right)) {
      this.graphics.use("walk-right");
      this.pos.x += 1;
    }
    if (engine.input.keyboard.wasPressed(this.#controls.placeBomb)) {
      const bomb = Bomb.snapToGrid(this.pos);
      engine.add(bomb);
    }

    if (engine.input.keyboard.getKeys().length === 0) {
      this.graphics.use("idle");
    }
  }

  onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner.name === "explosion") {
      this.#isKilled = true;
      this.graphics.use("die");
    }
  }
}
