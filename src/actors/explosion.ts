import * as ex from "excalibur";
import { Resources } from "../resources.ts";
import { AnimationsComponent } from "../components/animations.ts";

const spriteSheet = ex.SpriteSheet.fromImageSource({
  image: Resources.img.explosion,
  grid: {
    columns: 10,
    rows: 10,
    spriteWidth: 16,
    spriteHeight: 16,
  },
});

export class Explosion extends ex.Actor {
  #animations: AnimationsComponent<"explode">;

  constructor() {
    super({
      name: "Explosion",
      width: 25,
      height: 25,
    });

    const explodeAnimation = ex.Animation.fromSpriteSheetCoordinates({
      spriteSheet: spriteSheet,
      frameCoordinates: [
        {
          x: 2,
          y: 2,
        },
        {
          x: 7,
          y: 2,
        },
        {
          x: 2,
          y: 7,
        },
        {
          x: 7,
          y: 7,
        },
        {
          x: 2,
          y: 7,
        },
        {
          x: 7,
          y: 2,
        },
        {
          x: 2,
          y: 2,
        },
      ],
      strategy: ex.AnimationStrategy.End,
      durationPerFrame: 500,
    });
    explodeAnimation.events.on("end", () => {
      this.kill();
    });

    this.#animations = new AnimationsComponent({
      explode: explodeAnimation,
    });

    this.addComponent(this.#animations);
  }

  override onInitialize(_engine: ex.Engine): void {
    this.#animations.set("explode");
  }
}
