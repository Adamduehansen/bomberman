import * as ex from "excalibur";
import { Resources } from "../resources.ts";
import { ExplosionCollisionGroup } from "../collision-groups.ts";

type ExplosionPart = "center" | "vertical" | "horizonal";

const ExplosionAnimationFactory: {
  [key in ExplosionPart]: ex.FromSpriteSheetOptions["frameCoordinates"];
} = {
  center: [
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
  horizonal: [
    {
      x: 1,
      y: 2,
    },
    {
      x: 6,
      y: 2,
    },
    {
      x: 1,
      y: 7,
    },
    {
      x: 6,
      y: 7,
    },
    {
      x: 1,
      y: 7,
    },
    {
      x: 6,
      y: 2,
    },
    {
      x: 1,
      y: 2,
    },
  ],
  vertical: [
    {
      x: 2,
      y: 1,
    },
    {
      x: 7,
      y: 1,
    },
    {
      x: 2,
      y: 6,
    },
    {
      x: 7,
      y: 6,
    },
    {
      x: 2,
      y: 6,
    },
    {
      x: 7,
      y: 1,
    },
    {
      x: 2,
      y: 1,
    },
  ],
};

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
  constructor() {
    super({
      name: "Explosion",
      width: 25,
      height: 25,
      collisionGroup: ExplosionCollisionGroup,
      collisionType: ex.CollisionType.Fixed,
    });

    const explodeAnimation = ex.Animation.fromSpriteSheetCoordinates({
      spriteSheet: spriteSheet,
      frameCoordinates: ExplosionAnimationFactory["vertical"],
      strategy: ex.AnimationStrategy.End,
      durationPerFrame: 500,
    });
    explodeAnimation.events.on("end", () => {
      this.kill();
    });

    this.graphics.use(explodeAnimation);
  }
}
