import * as ex from "excalibur";
import { Explosion } from "./explosion.ts";
import { AnimationsComponent } from "../components/animations.ts";
import { Resources } from "../resources.ts";
import { BombCollisonGroup } from "../collision-groups.ts";

interface Args {
  pos: ex.Vector;
}

const spriteSheet = ex.SpriteSheet.fromImageSource({
  image: Resources.img.bomb,
  grid: {
    columns: 3,
    rows: 1,
    spriteHeight: 16,
    spriteWidth: 16,
  },
});

export class Bomb extends ex.Actor {
  #animations = new AnimationsComponent({
    idle: ex.Animation.fromSpriteSheet(spriteSheet, ex.range(0, 2), 100),
  });

  constructor(args: Args) {
    super({
      name: "Bomb",
      pos: args.pos,
      width: 25,
      height: 25,
      color: ex.Color.Yellow,
      collisionType: ex.CollisionType.Passive,
      collisionGroup: BombCollisonGroup,
    });

    this.addComponent(this.#animations);
  }

  override onInitialize(_engine: ex.Engine): void {
    this.#animations.set("idle");
    const killTimer = new ex.Timer({
      interval: 1_000,
      action: () => {
        this.kill();
      },
    });
    this.scene?.addTimer(killTimer);
    killTimer.start();
  }

  override onCollisionEnd(
    _self: ex.Collider,
    _other: ex.Collider,
    _side: ex.Side,
    _lastContact: ex.CollisionContact,
  ): void {
    this.body.collisionType = ex.CollisionType.Fixed;
  }

  override onPreKill(scene: ex.Scene): void {
    const explosion = new Explosion({
      pos: ex.vec(this.pos.x, this.pos.y),
    });
    scene.add(explosion);
  }
}
