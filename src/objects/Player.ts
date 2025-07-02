import * as ex from "excalibur";
import { Resources, spriteSheet } from "../resources.ts";
import Bomb from "./Bomb.ts";
import SceneManager from "../SceneManager.ts";

interface Controls {
  up: ex.Keys;
  right: ex.Keys;
  down: ex.Keys;
  left: ex.Keys;
  placeBomb: ex.Keys;
}

type PlayerArgs = Required<Pick<ex.ActorArgs, "x" | "y">> & {
  controls: Controls;
};

const SPEED = 60;

export default class Player extends ex.Actor {
  #controls: Controls;

  #disableControls: boolean = false;

  constructor({ x, y, controls }: PlayerArgs) {
    super({
      x: x,
      y: y,
      name: "Player",
      collider: ex.Shape.Circle(8),
      collisionType: ex.CollisionType.Active,
      z: 10,
    });
    this.#controls = controls;
  }

  override onInitialize(engine: ex.Engine): void {
    this.graphics.add("idle", spriteSheet.getSprite(4, 0));
    this.graphics.add(
      "walk-down",
      ex.Animation.fromSpriteSheet(
        spriteSheet,
        ex.range(3, 5),
        100,
        ex.AnimationStrategy.PingPong,
      ),
    );
    this.graphics.add(
      "walk-up",
      ex.Animation.fromSpriteSheet(
        spriteSheet,
        ex.range(19, 21),
        100,
        ex.AnimationStrategy.PingPong,
      ),
    );
    this.graphics.add(
      "walk-left",
      ex.Animation.fromSpriteSheet(
        spriteSheet,
        ex.range(0, 2),
        100,
        ex.AnimationStrategy.PingPong,
      ),
    );
    this.graphics.add(
      "walk-right",
      ex.Animation.fromSpriteSheet(
        spriteSheet,
        ex.range(16, 18),
        100,
        ex.AnimationStrategy.PingPong,
      ),
    );
    const dieAnimation = ex.Animation.fromSpriteSheet(
      spriteSheet,
      ex.range(32, 38),
      100,
      ex.AnimationStrategy.End,
    );
    dieAnimation.events.on("end", () => {
      this.kill();
      SceneManager.goToScene(engine, "gameoverscene");
    });
    this.graphics.add(
      "die",
      dieAnimation,
    );
    this.graphics.use("idle");
  }

  override onPreUpdate(engine: ex.Engine): void {
    if (this.#disableControls) {
      this.#stopMovement();
      return;
    }

    if (engine.input.keyboard.isHeld(this.#controls.down)) {
      this.graphics.use("walk-down");
      this.vel.y = SPEED;
    } else if (engine.input.keyboard.isHeld(this.#controls.up)) {
      this.graphics.use("walk-up");
      this.vel.y = -SPEED;
    }

    if (engine.input.keyboard.isHeld(this.#controls.left)) {
      this.graphics.use("walk-left");
      this.vel.x = -SPEED;
    } else if (engine.input.keyboard.isHeld(this.#controls.right)) {
      this.graphics.use("walk-right");
      this.vel.x = SPEED;
    }
    if (engine.input.keyboard.wasPressed(this.#controls.placeBomb)) {
      const bomb = Bomb.snapToGrid(this.pos);
      engine.add(bomb);
    }

    if (engine.input.keyboard.getKeys().length === 0) {
      this.graphics.use("idle");
      this.#stopMovement();
    }
  }

  override onCollisionStart(_self: ex.Collider, other: ex.Collider): void {
    const { name: otherName } = other.owner;

    if (otherName === "explosion" || otherName === "balloon") {
      this.#disableControls = true;
      this.graphics.use("die");
      Resources.death.play(0.15);
    }

    if (otherName === "door") {
      this.#disableControls = true;
      this.graphics.use("idle");
      Resources.door.play(.5);
      SceneManager.goToScene(this.scene!.engine, "gameoverscene");
    }
  }

  #stopMovement(): void {
    this.vel = ex.Vector.Zero;
  }
}
