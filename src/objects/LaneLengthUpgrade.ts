import { Actor, ActorArgs } from "excalibur";
import { spriteSheet } from "../resources.ts";

export default class LaneLengthUpgrade extends Actor {
  constructor(args: ActorArgs) {
    super({
      ...args,
      name: "LaneLengthUpgrade",
    });
  }

  onInitialize(): void {
    this.graphics.use(spriteSheet.getSprite(0, 14));
  }
}
