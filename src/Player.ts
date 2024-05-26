import {
  Actor,
  ActorArgs,
  CollisionType,
  Engine,
  Keys,
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
    this.graphics.use(spriteSheet.getSprite(5, 0));
  }

  onPreUpdate(engine: Engine): void {
    if (engine.input.keyboard.isHeld(Keys.S)) {
      this.pos.y += 1;
    }
    if (engine.input.keyboard.isHeld(Keys.W)) {
      this.pos.y -= 1;
    }
    if (engine.input.keyboard.isHeld(Keys.A)) {
      this.pos.x -= 1;
    }
    if (engine.input.keyboard.isHeld(Keys.D)) {
      this.pos.x += 1;
    }
  }
}
