import {
  Actor,
  ActorArgs,
  Animation,
  AnimationStrategy,
  Random,
} from "excalibur";
import { spriteSheet } from "../resources.ts";
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

const DIRECTIONS = ["up", "right", "down", "left"] as const;
type Direction = typeof DIRECTIONS[number];

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

type Destination = Required<Pick<ActorArgs, "x" | "y">>;

export default class BalloonEnemy extends Actor {
  #destination: Destination;

  constructor(args: ActorArgs) {
    super({
      ...args,
      name: "BalloonEnemy",
      z: 10,
    });
    this.#destination = { x: this.pos.x, y: this.pos.y };
  }

  onInitialize(): void {
    this.graphics.add("walk-right", walkRightAnimation);
    this.graphics.add("walk-left", walkLeftAnimation);
    this.graphics.use("walk-right");
  }

  onPreUpdate(): void {
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
