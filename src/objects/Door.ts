import { Actor, ActorArgs, CollisionType, Shape } from "excalibur";
import { spriteSheet } from "../resources.ts";

export default class Door extends Actor {
  constructor(args: ActorArgs) {
    super({
      ...args,
      name: "door",
      collisionType: CollisionType.Passive,
      collider: Shape.Box(1, 1),
    });
  }

  onInitialize(): void {
    this.graphics.use(spriteSheet.getSprite(11, 3));
  }
}
