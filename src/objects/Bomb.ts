import {
  Actor,
  ActorArgs,
  Animation,
  AnimationStrategy,
  Engine,
  Timer,
} from "excalibur";
import { spriteSheet } from "../resources.ts";
import Explosion from "./Explosion.ts";
import inventoryManager from "../InventoryManager.ts";

export default class Bomb extends Actor {
  static snapToGrid({ x, y }: Required<Pick<ActorArgs, "x" | "y">>): Bomb {
    const offsetFromSnappedX = (x - 16) % 16;
    const snappedX = 8 + x - offsetFromSnappedX;

    const offsetFromSnappedY = (y - 16) % 16;
    const snappedY = 8 + y - offsetFromSnappedY;

    return new Bomb({
      x: snappedX,
      y: snappedY,
    });
  }

  onInitialize(engine: Engine): void {
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

    const bombTimer = new Timer({
      interval: 1000,
      fcn: () => {
        const explosion = new Explosion({
          x: this.pos.x,
          y: this.pos.y,
          maxLength: inventoryManager.laneLength,
        });
        engine.add(explosion);
        this.kill();
      },
    });
    engine.addTimer(bombTimer);
    bombTimer.start();
  }
}
