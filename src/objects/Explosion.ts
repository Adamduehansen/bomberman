import {
  Actor,
  ActorArgs,
  CollisionType,
  Engine,
  PolygonCollider,
  randomInRange,
  Shape,
  Sound,
  Sprite,
  Timer,
  vec,
  Vector,
} from "excalibur";
import { Resources, spriteSheet } from "../resources.ts";
import map from "../Map.ts";

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

function getExplosionCollider(direction: Direction): PolygonCollider | never {
  switch (direction) {
    case "left":
    case "right":
      return Shape.Box(16, 8);
    case "buttom":
    case "top":
      return Shape.Box(8, 16);
  }
}

class ExplosionLane extends Actor {
  #direction: Direction;

  constructor({ x, y, direction }: ActorArgs & {
    direction: Direction;
  }) {
    super({
      name: "explosion",
      x: x,
      y: y,
      collider: getExplosionCollider(direction),
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
  top: [vec(-4, 8), vec(-4, 0), vec(4, 0), vec(4, 8)],
  right: [vec(-8, -4), vec(0, -4), vec(0, 4), vec(-8, 4)],
  buttom: [vec(-4, -8), vec(4, -8), vec(4, 0), vec(-4, 0)],
  left: [vec(8, 4), vec(0, 4), vec(0, -4), vec(8, -4)],
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
    this.#getExplosionSound(Math.floor(randomInRange(1, 3))).play();

    this.addChild(new ExplosionCenter());

    this.#createTopArm(engine);
    this.#createRightArm(engine);
    this.#createBottomArm(engine);
    this.#createLeftArm(engine);

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
      interval: 100,
      numberOfRepeats: NUMBER_OF_FRAMES_IN_ANIMATION,
      repeats: true,
    });

    engine.addTimer(timer);
    timer.start();
  }

  #getExplosionSound(index: number): Sound {
    switch (index) {
      case 1:
        return Resources.explosion1;
      case 2:
        return Resources.explosion2;
      default:
        throw new Error(`Explosion not found for index: ${index}`);
    }
  }

  #createTopArm(engine: Engine) {
    let lengthOfArm = 0;
    for (let index = 1; index <= this.#maxLength; index++) {
      if (map.isWallAt(this.pos.x, this.pos.y - index * 16)) {
        break;
      }
      if (
        engine.currentScene.actors.filter((actor) =>
          actor.name === "Destructable Wall"
        ).some((wall) =>
          wall.pos.x === this.pos.x && wall.pos.y === this.pos.y - index * 16
        )
      ) {
        lengthOfArm += 1;
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

  #createRightArm(engine: Engine) {
    let lengthOfArm = 0;
    for (let index = 1; index <= this.#maxLength; index++) {
      if (map.isWallAt(this.pos.x + index * 16, this.pos.y)) {
        break;
      }
      if (
        engine.currentScene.actors.filter((actor) =>
          actor.name === "Destructable Wall"
        ).some((wall) =>
          wall.pos.x === this.pos.x + index * 16 && wall.pos.y === this.pos.y
        )
      ) {
        lengthOfArm += 1;
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

  #createBottomArm(engine: Engine) {
    let lengthOfArm = 0;
    for (let index = 1; index <= this.#maxLength; index++) {
      if (map.isWallAt(this.pos.x, this.pos.y + index * 16)) {
        break;
      }
      if (
        engine.currentScene.actors.filter((actor) =>
          actor.name === "Destructable Wall"
        ).some((wall) =>
          wall.pos.x === this.pos.x && wall.pos.y === this.pos.y + index * 16
        )
      ) {
        lengthOfArm += 1;
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

  #createLeftArm(engine: Engine) {
    let lengthOfArm = 0;
    for (let index = 1; index <= this.#maxLength; index++) {
      if (map.isWallAt(this.pos.x - index * 16, this.pos.y)) {
        break;
      }
      if (
        engine.currentScene.actors.filter((actor) =>
          actor.name === "Destructable Wall"
        ).some((wall) =>
          wall.pos.x === this.pos.x - index * 16 && wall.pos.y === this.pos.y
        )
      ) {
        lengthOfArm += 1;
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
