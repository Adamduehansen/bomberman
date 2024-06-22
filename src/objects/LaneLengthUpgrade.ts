import { Actor, ActorArgs, Collider, CollisionType, Shape } from "excalibur";
import { spriteSheet } from "../resources.ts";
import inventoryManager from "../InventoryManager.ts";

export default class LaneLengthUpgrade extends Actor {
  constructor(args: ActorArgs) {
    super({
      ...args,
      name: "LaneLengthUpgrade",
      collisionType: CollisionType.Passive,
      collider: Shape.Box(16, 16),
    });
  }

  onInitialize(): void {
    this.graphics.use(spriteSheet.getSprite(0, 14));
  }

  onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner.name === "Player") {
      inventoryManager.upgradeLaneLength();
    }
    this.kill();
  }
}
