import { Actor, ActorArgs, Engine, Timer } from "excalibur";
import { spriteSheet } from "./resources.ts";
import map from "./Map.ts";

const NUMBER_OF_FRAMES_IN_ANIMATION = 7;

interface Args extends Required<Pick<ActorArgs, "x" | "y">> {
  maxLength: number;
}

export default class Explosion extends Actor {
  #maxLength: number;
  #graphicsIndex: number;

  constructor({ x, y, maxLength }: Args) {
    super({
      x: x,
      y: y,
    });
    this.#maxLength = maxLength;
    this.#graphicsIndex = 1;
  }

  onInitialize(engine: Engine): void {
    const explosionCenter = new Actor();
    explosionCenter.graphics.add("1", spriteSheet.getSprite(2, 6));
    explosionCenter.graphics.add("2", spriteSheet.getSprite(7, 6));
    explosionCenter.graphics.add("3", spriteSheet.getSprite(2, 11));
    explosionCenter.graphics.add("4", spriteSheet.getSprite(7, 11));
    explosionCenter.graphics.add("5", spriteSheet.getSprite(2, 11));
    explosionCenter.graphics.add("6", spriteSheet.getSprite(7, 6));
    explosionCenter.graphics.add("7", spriteSheet.getSprite(2, 6));
    explosionCenter.graphics.use(this.#graphicsIndex.toString());
    this.addChild(explosionCenter);

    this.#createTopArm();
    this.#createRightArm();
    this.#createBottomArm();
    this.#createLeftArm();

    const timer = new Timer({
      fcn: () => {
        if (this.#graphicsIndex === NUMBER_OF_FRAMES_IN_ANIMATION) {
          this.kill();
          return;
        }

        this.#graphicsIndex += 1;
        explosionCenter.graphics.use(this.#graphicsIndex.toString());
      },
      interval: 200,
      numberOfRepeats: NUMBER_OF_FRAMES_IN_ANIMATION,
      repeats: true,
    });

    engine.addTimer(timer);
    timer.start();
  }

  #createTopArm() {
    let lengthOfArm = 0;
    for (let index = 1; index <= this.#maxLength; index++) {
      if (map.isWallAt(this.pos.x, this.pos.y - index * 16)) {
        break;
      }
      lengthOfArm += 1;
    }

    for (let index = 1; index <= lengthOfArm; index++) {
      const explosionLane = new Actor({
        y: -(index * 16),
      });
      if (index === lengthOfArm) {
        explosionLane.graphics.use(spriteSheet.getSprite(2, 4));
      } else {
        explosionLane.graphics.use(spriteSheet.getSprite(2, 5));
      }
      this.addChild(explosionLane);
    }
  }

  #createRightArm() {
    let lengthOfArm = 0;
    for (let index = 1; index <= this.#maxLength; index++) {
      if (map.isWallAt(this.pos.x + index * 16, this.pos.y)) {
        break;
      }
      lengthOfArm += 1;
    }

    for (let index = 1; index <= lengthOfArm; index++) {
      const explosionLane = new Actor({
        x: index * 16,
      });
      if (index === lengthOfArm) {
        explosionLane.graphics.use(spriteSheet.getSprite(4, 6));
      } else {
        explosionLane.graphics.use(spriteSheet.getSprite(3, 6));
      }
      this.addChild(explosionLane);
    }
  }

  #createBottomArm() {
    let lengthOfArm = 0;
    for (let index = 1; index <= this.#maxLength; index++) {
      if (map.isWallAt(this.pos.x, this.pos.y + index * 16)) {
        break;
      }
      lengthOfArm += 1;
    }

    for (let index = 1; index <= lengthOfArm; index++) {
      const explosionLane = new Actor({
        y: index * 16,
      });
      if (index === lengthOfArm) {
        explosionLane.graphics.use(spriteSheet.getSprite(2, 8));
      } else {
        explosionLane.graphics.use(spriteSheet.getSprite(2, 7));
      }
      this.addChild(explosionLane);
    }
  }

  #createLeftArm() {
    let lengthOfArm = 0;
    for (let index = 1; index <= this.#maxLength; index++) {
      if (map.isWallAt(this.pos.x - index * 16, this.pos.y)) {
        break;
      }
      lengthOfArm += 1;
    }

    for (let index = 1; index <= lengthOfArm; index++) {
      const explosionLane = new Actor({
        x: -(index * 16),
      });
      if (index === lengthOfArm) {
        explosionLane.graphics.use(spriteSheet.getSprite(0, 6));
      } else {
        explosionLane.graphics.use(spriteSheet.getSprite(1, 6));
      }
      this.addChild(explosionLane);
    }
  }
}
