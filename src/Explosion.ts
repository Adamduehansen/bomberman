import { Actor, ActorArgs } from "excalibur";
import { spriteSheet } from "./resources.ts";
import map from "./Map.ts";

export default class Explosion extends Actor {
  constructor({ x, y }: Required<Pick<ActorArgs, "x" | "y">>) {
    super({
      x: x,
      y: y,
    });
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
    if (map.isWallAt(this.pos.x, this.pos.y - 16)) {
      return;
    }

    const explosionTopArm = new Actor({
      y: -16,
    });
    explosionTopArm.graphics.use(spriteSheet.getSprite(2, 5));
    this.addChild(explosionTopArm);

    const explosionTopEnd = new Actor({
      y: -32,
    });
    explosionTopEnd.graphics.use(spriteSheet.getSprite(2, 4));
    this.addChild(explosionTopEnd);
  }

  #createRightArm() {
    if (map.isWallAt(this.pos.x + 16, this.pos.y)) {
      return;
    }

    const explosionRightArm = new Actor({
      x: 16,
    });
    explosionRightArm.graphics.use(spriteSheet.getSprite(3, 6));
    this.addChild(explosionRightArm);

    const explosionRightEnd = new Actor({
      x: 32,
    });
    explosionRightEnd.graphics.use(spriteSheet.getSprite(4, 6));
    this.addChild(explosionRightEnd);
  }

  #createBottomArm() {
    if (map.isWallAt(this.pos.x, this.pos.y + 16)) {
      return;
    }

    const explosionBottomArm = new Actor({
      y: 16,
    });
    explosionBottomArm.graphics.use(spriteSheet.getSprite(2, 7));
    this.addChild(explosionBottomArm);

    const explosionBottomEnd = new Actor({
      y: 32,
    });
    explosionBottomEnd.graphics.use(spriteSheet.getSprite(2, 8));
    this.addChild(explosionBottomEnd);
  }

  #createLeftArm() {
    if (map.isWallAt(this.pos.x - 16, this.pos.y)) {
      return;
    }

    const explosionLeftArm = new Actor({
      x: -16,
    });
    explosionLeftArm.graphics.use(spriteSheet.getSprite(1, 6));
    this.addChild(explosionLeftArm);

    const explosionLeftEnd = new Actor({
      x: -32,
    });
    explosionLeftEnd.graphics.use(spriteSheet.getSprite(0, 6));
    this.addChild(explosionLeftEnd);
  }
}
