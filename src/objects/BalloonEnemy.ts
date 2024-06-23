import {
  Actor,
  ActorArgs,
  Animation,
  AnimationStrategy,
  Collider,
  CollisionType,
  Engine,
  FromSpriteSheetOptions,
  Random,
  Shape,
  Vector,
} from "excalibur";
import { Resources, spriteSheet } from "../resources.ts";
import map from "../Map.ts";

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

  #disableControls: boolean = false;

  constructor(args: ActorArgs) {
    super({
      ...args,
      name: "balloon",
      collider: Shape.Circle(8),
      collisionType: CollisionType.Passive,
      z: 10,
    });
    this.#destination = { x: this.pos.x, y: this.pos.y };
  }

  onInitialize(): void {
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

    this.graphics.add("look-right", walkRightAnimation);
    this.graphics.add("look-left", walkLeftAnimation);
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
    this.graphics.use("look-right");
  }

  onPreUpdate(engine: Engine): void {
    if (this.#disableControls) {
      this.#stopMovement();
      return;
    }

    if (this.#isAtDestination()) {
      this.#stopMovement();
      const newDestination = this.#getNewDestination();
      const nonCollidableObjects = engine.currentScene.actors.filter((actor) =>
        actor.name === "Destructable Wall" || actor.name === "bomb"
      );

      if (
        map.isWallAt(newDestination.x, newDestination.y) ||
        nonCollidableObjects.some((wall) =>
          wall.pos.x === newDestination.x && wall.pos.y === newDestination.y
        )
      ) {
        return;
      }

      this.#destination = newDestination;
      if (this.#destination.x < this.pos.x) {
        this.graphics.use("look-left");
      } else if (this.#destination.x > this.pos.x) {
        this.graphics.use("look-right");
      }
    } else {
      if (this.pos.y < this.#destination.y) {
        this.vel.y = 30;
      } else if (this.pos.y > this.#destination.y) {
        this.vel.y = -30;
      }
      if (this.pos.x < this.#destination.x) {
        this.vel.x = 30;
      } else if (this.pos.x > this.#destination.x) {
        this.vel.x = -30;
      }
    }
  }

  onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner.name === "explosion") {
      this.#disableControls = true;
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

  #stopMovement(): void {
    this.vel = Vector.Zero;
  }
}
