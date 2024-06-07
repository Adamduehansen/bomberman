import {
  Actor,
  ActorArgs,
  CollisionType,
  Engine,
  Shape,
  Sprite,
  Timer,
  vec,
  Vector,
} from "excalibur";
import { spriteSheet } from "./resources.ts";
import map from "./Map.ts";

const NUMBER_OF_FRAMES_IN_ANIMATION = 7;

interface Args extends Required<Pick<ActorArgs, "x" | "y">> {
  maxLength: number;
}

type Direction = "top" | "right" | "buttom" | "left";

class ExplosionCenter extends Actor {
  onInitialize(): void {
    this.graphics.add("1", spriteSheet.getSprite(2, 6));
    this.graphics.add("2", spriteSheet.getSprite(7, 6));
    this.graphics.add("3", spriteSheet.getSprite(2, 11));
    this.graphics.add("4", spriteSheet.getSprite(7, 11));
    this.graphics.add("5", spriteSheet.getSprite(2, 11));
    this.graphics.add("6", spriteSheet.getSprite(7, 6));
    this.graphics.add("7", spriteSheet.getSprite(2, 6));
    this.graphics.use("1");
  }
}

const EXPLOSION_LANE_SPRITE_MAP: {
  [key in Direction]: [Sprite, Sprite, Sprite, Sprite];
} = {
  top: [
    spriteSheet.getSprite(2, 5),
    spriteSheet.getSprite(7, 5),
    spriteSheet.getSprite(2, 10),
    spriteSheet.getSprite(7, 10),
  ],
  right: [
    spriteSheet.getSprite(3, 6),
    spriteSheet.getSprite(8, 6),
    spriteSheet.getSprite(3, 11),
    spriteSheet.getSprite(8, 11),
  ],
  buttom: [
    spriteSheet.getSprite(2, 7),
    spriteSheet.getSprite(7, 7),
    spriteSheet.getSprite(2, 12),
    spriteSheet.getSprite(7, 12),
  ],
  left: [
    spriteSheet.getSprite(1, 6),
    spriteSheet.getSprite(6, 6),
    spriteSheet.getSprite(1, 11),
    spriteSheet.getSprite(6, 11),
  ],
};

class ExplosionLane extends Actor {
  #direction: Direction;

  constructor({ x, y, direction }: ActorArgs & {
    direction: Direction;
  }) {
    super({
      x: x,
      y: y,
      collider: Shape.Box(16, 16),
      collisionType: CollisionType.Passive,
    });
    this.#direction = direction;
  }

  onInitialize(): void {
    this.graphics.add("1", EXPLOSION_LANE_SPRITE_MAP[this.#direction][0]);
    this.graphics.add("2", EXPLOSION_LANE_SPRITE_MAP[this.#direction][1]);
    this.graphics.add("3", EXPLOSION_LANE_SPRITE_MAP[this.#direction][2]);
    this.graphics.add("4", EXPLOSION_LANE_SPRITE_MAP[this.#direction][3]);
    this.graphics.add("5", EXPLOSION_LANE_SPRITE_MAP[this.#direction][2]);
    this.graphics.add("6", EXPLOSION_LANE_SPRITE_MAP[this.#direction][1]);
    this.graphics.add("7", EXPLOSION_LANE_SPRITE_MAP[this.#direction][0]);
    this.graphics.use("1");
  }
}

const EXPLOSION_END_SPRITE_MAP: {
  [key in Direction]: [Sprite, Sprite, Sprite, Sprite];
} = {
  top: [
    spriteSheet.getSprite(2, 4),
    spriteSheet.getSprite(7, 4),
    spriteSheet.getSprite(2, 9),
    spriteSheet.getSprite(7, 9),
  ],
  right: [
    spriteSheet.getSprite(4, 6),
    spriteSheet.getSprite(9, 6),
    spriteSheet.getSprite(4, 11),
    spriteSheet.getSprite(9, 11),
  ],
  buttom: [
    spriteSheet.getSprite(2, 8),
    spriteSheet.getSprite(7, 8),
    spriteSheet.getSprite(2, 13),
    spriteSheet.getSprite(7, 13),
  ],
  left: [
    spriteSheet.getSprite(0, 6),
    spriteSheet.getSprite(5, 6),
    spriteSheet.getSprite(0, 11),
    spriteSheet.getSprite(5, 11),
  ],
};

const EXPLOSION_END_COLLIDER_VECTORS: {
  [key in Direction]: Vector[];
} = {
  top: [vec(-8, 8), vec(-8, 0), vec(8, 0), vec(8, 8)],
  right: [vec(-8, -8), vec(0, -8), vec(0, 8), vec(-8, 8)],
  buttom: [vec(-8, -8), vec(8, -8), vec(8, 0), vec(-8, 0)],
  left: [vec(8, 8), vec(0, 8), vec(0, -8), vec(8, -8)],
};

class ExplosionEnd extends Actor {
  #direction: Direction;

  constructor({ x, y, direction }: ActorArgs & {
    direction: Direction;
  }) {
    super({
      name: "explosion",
      x: x,
      y: y,
      collider: Shape.Polygon(EXPLOSION_END_COLLIDER_VECTORS[direction]),
      collisionType: CollisionType.Passive,
    });
    this.#direction = direction;
  }

  onInitialize(): void {
    this.graphics.add("1", EXPLOSION_END_SPRITE_MAP[this.#direction][0]);
    this.graphics.add("2", EXPLOSION_END_SPRITE_MAP[this.#direction][1]);
    this.graphics.add("3", EXPLOSION_END_SPRITE_MAP[this.#direction][2]);
    this.graphics.add("4", EXPLOSION_END_SPRITE_MAP[this.#direction][3]);
    this.graphics.add("5", EXPLOSION_END_SPRITE_MAP[this.#direction][2]);
    this.graphics.add("6", EXPLOSION_END_SPRITE_MAP[this.#direction][1]);
    this.graphics.add("7", EXPLOSION_END_SPRITE_MAP[this.#direction][0]);
    this.graphics.use("1");
  }
}

export default class Explosion extends Actor {
  #maxLength: number;
  #graphicsIndex: number;

  constructor({ x, y, maxLength }: Args) {
    super({
      name: "explosion",
      x: x,
      y: y,
      collider: Shape.Box(16, 16),
      collisionType: CollisionType.Passive,
    });
    this.#maxLength = maxLength;
    this.#graphicsIndex = 1;
  }

  onInitialize(engine: Engine): void {
    this.addChild(new ExplosionCenter());

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
        this.children.forEach((children) => {
          // @ts-ignore Every explosion has a graphic component.
          children.graphics.use(this.#graphicsIndex.toString());
        });
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
      if (index === lengthOfArm) {
        this.addChild(
          new ExplosionEnd({
            y: -(index * 16),
            direction: "top",
          }),
        );
      } else {
        this.addChild(
          new ExplosionLane({
            y: -(index * 16),
            direction: "top",
          }),
        );
      }
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
      if (index === lengthOfArm) {
        this.addChild(
          new ExplosionEnd({
            x: index * 16,
            direction: "right",
          }),
        );
      } else {
        this.addChild(
          new ExplosionLane({
            x: index * 16,
            direction: "right",
          }),
        );
      }
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
      if (index === lengthOfArm) {
        this.addChild(
          new ExplosionEnd({
            y: index * 16,
            direction: "buttom",
          }),
        );
      } else {
        this.addChild(
          new ExplosionLane({
            y: index * 16,
            direction: "buttom",
          }),
        );
      }
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
      if (index === lengthOfArm) {
        this.addChild(
          new ExplosionEnd({
            x: -(index * 16),
            direction: "left",
          }),
        );
      } else {
        this.addChild(
          new ExplosionLane({
            x: -(index * 16),
            direction: "left",
          }),
        );
      }
    }
  }
}
