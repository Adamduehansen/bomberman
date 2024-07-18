import {
  Actor,
  ActorArgs,
  Animation,
  AnimationStrategy,
  Collider,
  CollisionType,
  range,
  Shape,
} from "excalibur";
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
    const destroyingAnimation = Animation.fromSpriteSheet(
      spriteSheet,
      range(53, 58),
      100,
      AnimationStrategy.End,
    );
    destroyingAnimation.events.on("end", () => {
      this.kill();
    });
    this.graphics.add(
      "destroying",
      destroyingAnimation,
    );

    this.graphics.use("idle");
  }

  onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner.name === "explosion") {
      this.graphics.use("destroying");
      this.scene?.camera.shake(5, 5, 500);
    }
  }
}
