import { Actor, ActorArgs } from "excalibur";
import { spriteSheet } from "./resources.ts";
import map from "./Map.ts";

interface Args extends Required<Pick<ActorArgs, "x" | "y">> {
  maxLength: number;
}

export default class Explosion extends Actor {
  #maxLength: number;

  constructor({ x, y, maxLength }: Args) {
    super({
      x: x,
      y: y,
    });
    this.#maxLength = maxLength;
  }

  onInitialize(): void {
    const explosionCenter = new Actor();
    explosionCenter.graphics.use(spriteSheet.getSprite(2, 6));
    this.addChild(explosionCenter);

    this.#createTopArm();
    this.#createRightArm();
    this.#createBottomArm();
    this.#createLeftArm();
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

    // if (map.isWallAt(this.pos.x - 16, this.pos.y)) {
    //   return;
    // }

    // const explosionLeftArm = new Actor({
    //   x: -16,
    // });
    // explosionLeftArm.graphics.use(spriteSheet.getSprite(1, 6));
    // this.addChild(explosionLeftArm);

    // const explosionLeftEnd = new Actor({
    //   x: -32,
    // });
    // explosionLeftEnd.graphics.use(spriteSheet.getSprite(0, 6));
    // this.addChild(explosionLeftEnd);
  }
}
