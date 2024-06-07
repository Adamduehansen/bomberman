import {
  Actor,
  ActorArgs,
  Animation,
  AnimationStrategy,
  Collider,
  FromSpriteSheetOptions,
  Random,
  Shape,
} from "excalibur";
import { Resources, spriteSheet } from "../resources.ts";
import map from "../Map.ts";

const walkRightAnimation = Animation.fromSpriteSheetCoordinates({
  spriteSheet: spriteSheet,
  frameCoordinates: [
    {
      x: 0,
      y: 15,
    },
    {
      x: 1,
      y: 15,
    },
    {
      x: 2,
      y: 15,
    },
  ],
  durationPerFrameMs: 200,
  strategy: AnimationStrategy.PingPong,
});

const walkLeftAnimation = Animation.fromSpriteSheetCoordinates({
  spriteSheet: spriteSheet,
  frameCoordinates: [
    {
      x: 3,
      y: 15,
    },
    {
      x: 4,
      y: 15,
    },
    {
      x: 5,
      y: 15,
    },
  ],
  durationPerFrameMs: 200,
  strategy: AnimationStrategy.PingPong,
});

const dieAnimationFrames: FromSpriteSheetOptions["frameCoordinates"] = [
  {
    x: 6,
    y: 15,
    duration: 1000,
  },
  {
    x: 7,
    y: 15,
  },
  {
    x: 8,
    y: 15,
  },
  {
    x: 9,
    y: 15,
  },
  {
    x: 10,
    y: 15,
  },
];

const DIRECTIONS = ["up", "right", "down", "left"] as const;
type Direction = typeof DIRECTIONS[number];

type Destination = Required<Pick<ActorArgs, "x" | "y">>;

export default class BalloonEnemy extends Actor {
  #destination: Destination;

  #isKilled: boolean = false;

  constructor(args: ActorArgs) {
    super({
      ...args,
      name: "BalloonEnemy",
      collider: Shape.Circle(8),
      z: 10,
    });
    this.#destination = { x: this.pos.x, y: this.pos.y };
  }

  onInitialize(): void {
    this.graphics.add("walk-right", walkRightAnimation);
    this.graphics.add("walk-left", walkLeftAnimation);
    const dieAnimation = Animation.fromSpriteSheetCoordinates({
      spriteSheet: spriteSheet,
      frameCoordinates: dieAnimationFrames,
      durationPerFrameMs: 200,
      strategy: AnimationStrategy.End,
    });
    dieAnimation.events.on("end", () => {
      this.kill();
    });
    this.graphics.add("die", dieAnimation);
    this.graphics.use("walk-right");
  }

  onPreUpdate(): void {
    if (this.#isKilled) {
      return;
    }

    if (this.#isAtDestination()) {
      const newDestination = this.#getNewDestination();
      if (map.isWallAt(newDestination.x, newDestination.y) === null) {
        this.#destination = newDestination;
      }
    } else {
      if (this.pos.y < this.#destination.y) {
        this.pos.y += 0.5;
      } else if (this.pos.y > this.#destination.y) {
        this.pos.y -= 0.5;
      }
      if (this.pos.x < this.#destination.x) {
        this.pos.x += 0.5;
      } else if (this.pos.x > this.#destination.x) {
        this.pos.x -= 0.5;
      }
    }
  }

  onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner.name === "explosion") {
      this.#isKilled = true;
      this.graphics.use("die");
      Resources.balloonExplode.play();
    }
  }

  #isAtDestination(): boolean {
    return this.pos.x === this.#destination.x &&
      this.pos.y === this.#destination.y;
  }

  #getDirection(): Direction {
    const random = new Random();
    return random.pickOne([...DIRECTIONS]);
  }

  #getNewDestination(): Destination | never {
    switch (this.#getDirection()) {
      case "up":
        return { x: this.pos.x, y: this.pos.y - 16 };
      case "right":
        return { x: this.pos.x + 16, y: this.pos.y };
      case "down":
        return { x: this.pos.x, y: this.pos.y + 16 };
      case "left":
        return { x: this.pos.x - 16, y: this.pos.y };
    }
  }
}
