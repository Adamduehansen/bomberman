import * as ex from "excalibur";
import { AnimationsComponent } from "../components/animations.ts";

interface Args {
  name: string;
  pos: ex.Vector;
  spriteSheetImageSource: ex.ImageSource;
}

export abstract class Bomberman extends ex.Actor {
  protected readonly animations;

  constructor({ spriteSheetImageSource, ...args }: Args) {
    super({
      name: args.name,
      pos: args.pos,
      collisionType: ex.CollisionType.Active,
      collider: ex.Shape.Box(16, 16),
    });

    const spriteSheet = ex.SpriteSheet.fromImageSource({
      image: spriteSheetImageSource,
      grid: {
        columns: 7,
        rows: 3,
        spriteHeight: 16,
        spriteWidth: 16,
      },
    });

    this.animations = new AnimationsComponent({
      idle: spriteSheet.getSprite(4, 0),
      left: ex.Animation.fromSpriteSheet(
        spriteSheet,
        ex.range(0, 2),
        100,
        ex.AnimationStrategy.PingPong,
      ),
      right: ex.Animation.fromSpriteSheet(
        spriteSheet,
        ex.range(7, 9),
        100,
        ex.AnimationStrategy.PingPong,
      ),
      up: ex.Animation.fromSpriteSheet(
        spriteSheet,
        ex.range(10, 12),
        100,
        ex.AnimationStrategy.PingPong,
      ),
      down: ex.Animation.fromSpriteSheet(
        spriteSheet,
        ex.range(3, 5), // Adjust these indices if your spritesheet layout differs
        100,
        ex.AnimationStrategy.PingPong,
      ),
    });
  }

  override onInitialize(engine: ex.Engine): void {
    super.onInitialize(engine);
    this.addComponent(this.animations);
    this.animations.set("idle");
  }
}
