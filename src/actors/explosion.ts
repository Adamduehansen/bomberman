import * as ex from "excalibur";
import { Resources } from "../resources.ts";
import { ExplosionCollisionGroup } from "../collision-groups.ts";

type ExplosionPartAnimationKey =
  | "center"
  | "vertical"
  | "horizonal"
  | "top"
  | "right"
  | "bottom"
  | "left";

const ExplosionAnimationFactory: {
  [key in ExplosionPartAnimationKey]:
    ex.FromSpriteSheetOptions["frameCoordinates"];
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
  top: [
    {
      x: 2,
      y: 0,
    },
    {
      x: 7,
      y: 0,
    },
    {
      x: 2,
      y: 5,
    },
    {
      x: 7,
      y: 5,
    },
    {
      x: 2,
      y: 5,
    },
    {
      x: 7,
      y: 0,
    },
    {
      x: 2,
      y: 0,
    },
  ],
  right: [
    {
      x: 4,
      y: 2,
    },
    {
      x: 9,
      y: 2,
    },
    {
      x: 4,
      y: 7,
    },
    {
      x: 9,
      y: 7,
    },
    {
      x: 4,
      y: 7,
    },
    {
      x: 9,
      y: 2,
    },
    {
      x: 4,
      y: 2,
    },
  ],
  bottom: [
    {
      x: 2,
      y: 4,
    },
    {
      x: 7,
      y: 4,
    },
    {
      x: 2,
      y: 9,
    },
    {
      x: 7,
      y: 9,
    },
    {
      x: 2,
      y: 9,
    },
    {
      x: 7,
      y: 4,
    },
    {
      x: 2,
      y: 4,
    },
  ],
  left: [
    {
      x: 0,
      y: 2,
    },
    {
      x: 5,
      y: 2,
    },
    {
      x: 0,
      y: 7,
    },
    {
      x: 5,
      y: 7,
    },
    {
      x: 0,
      y: 7,
    },
    {
      x: 5,
      y: 2,
    },
    {
      x: 0,
      y: 2,
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

interface ExplosionPartArgs {
  pos: ex.Vector;
  explosionPart: ExplosionPartAnimationKey;
}

class ExplosionPart extends ex.Actor {
  constructor(args: ExplosionPartArgs) {
    super({
      name: `Explosion-${args.explosionPart}`,
      pos: args.pos,
      width: 25,
      height: 25,
      collisionGroup: ExplosionCollisionGroup,
      collisionType: ex.CollisionType.Fixed,
    });

    const explodeAnimation = ex.Animation.fromSpriteSheetCoordinates({
      spriteSheet: spriteSheet,
      frameCoordinates: ExplosionAnimationFactory[args.explosionPart],
      strategy: ex.AnimationStrategy.End,
      durationPerFrame: 100,
    });
    explodeAnimation.events.on("end", () => {
      this.kill();
    });

    this.graphics.use(explodeAnimation);
  }
}

export class ExplosionFactory {
  static createExplosionParts(pos: ex.Vector, size: number): ex.Actor[] {
    return [
      new ExplosionPart({
        explosionPart: "center",
        pos: ex.vec(pos.x, pos.y),
      }),
      new ExplosionPart({
        explosionPart: "vertical",
        pos: ex.vec(pos.x, pos.y - 16),
      }),
      new ExplosionPart({
        explosionPart: "top",
        pos: ex.vec(pos.x, pos.y - 32),
      }),
      // Right arm
      new ExplosionPart({
        explosionPart: "horizonal",
        pos: ex.vec(pos.x + 16, pos.y),
      }),
      new ExplosionPart({
        explosionPart: "right",
        pos: ex.vec(pos.x + 32, pos.y),
      }),
      // Bottom
      new ExplosionPart({
        explosionPart: "vertical",
        pos: ex.vec(pos.x, pos.y + 16),
      }),
      new ExplosionPart({
        explosionPart: "bottom",
        pos: ex.vec(pos.x, pos.y + 32),
      }),
      // Left
      new ExplosionPart({
        explosionPart: "horizonal",
        pos: ex.vec(pos.x - 16, pos.y),
      }),
      new ExplosionPart({
        explosionPart: "left",
        pos: ex.vec(pos.x - 32, pos.y),
      }),
    ];
  }
}
