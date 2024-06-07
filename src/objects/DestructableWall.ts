import { Actor, ActorArgs, CollisionType, Shape } from "excalibur";
import { spriteSheet } from "../resources.ts";

export default class DestructableWall extends Actor {
  constructor(args: ActorArgs) {
    super({
      ...args,
      name: "Destructable Wall",
      collider: Shape.Box(16, 16),
      collisionType: CollisionType.Fixed,
      z: 10,
    });
  }

  onInitialize(): void {
    this.graphics.add("idle", spriteSheet.getSprite(4, 3));

    this.graphics.use("idle");
  }
}
