import { Actor, ActorArgs, Animation, AnimationStrategy } from "excalibur";
import { spriteSheet } from "./resources.ts";

export default class Bomb extends Actor {
  constructor({ x, y }: Required<Pick<ActorArgs, "x" | "y">>) {
    super({
      x: x,
      y: y,
    });
  }

  onInitialize(): void {
    this.graphics.use(
      new Animation({
        frames: [
          {
            graphic: spriteSheet.getSprite(0, 3),
            duration: 100,
          },
          {
            graphic: spriteSheet.getSprite(1, 3),
            duration: 100,
          },
          {
            graphic: spriteSheet.getSprite(2, 3),
            duration: 100,
          },
        ],
        strategy: AnimationStrategy.PingPong,
      }),
    );
  }
}
