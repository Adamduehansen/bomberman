import {
  Actor,
  ActorArgs,
  Animation,
  AnimationStrategy,
  CollisionType,
  Engine,
  Keys,
  range,
  Shape,
} from "excalibur";
import { spriteSheet } from "./resources.ts";

export default class Player extends Actor {
  constructor(args: ActorArgs) {
    super({
      ...args,
      name: "Player",
      collider: Shape.Box(16, 16),
      collisionType: CollisionType.Active,
      z: 10,
    });
  }

  onInitialize(): void {
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
    this.graphics.use("idle");
  }

  onPreUpdate(engine: Engine): void {
    if (engine.input.keyboard.isHeld(Keys.S)) {
      this.graphics.use("walk-down");
      this.pos.y += 1;
    }
    if (engine.input.keyboard.isHeld(Keys.W)) {
      this.graphics.use("walk-up");
      this.pos.y -= 1;
    }
    if (engine.input.keyboard.isHeld(Keys.A)) {
      this.graphics.use("walk-left");
      this.pos.x -= 1;
    }
    if (engine.input.keyboard.isHeld(Keys.D)) {
      this.graphics.use("walk-right");
      this.pos.x += 1;
    }

    if (engine.input.keyboard.getKeys().length === 0) {
      this.graphics.use("idle");
    }
  }
}
