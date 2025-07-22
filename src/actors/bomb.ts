import * as ex from "excalibur";
import { Explosion } from "./explosion.ts";

interface Args {
  pos: ex.Vector;
}

export class Bomb extends ex.Actor {
  constructor(args: Args) {
    super({
      name: "Bomb",
      pos: args.pos,
      width: 25,
      height: 25,
      color: ex.Color.Yellow,
      collisionType: ex.CollisionType.Passive,
    });
  }

  override onInitialize(_engine: ex.Engine): void {
    const killTimer = new ex.Timer({
      interval: 2_000,
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
    const explosion = new Explosion();
    explosion.pos = ex.vec(this.pos.x, this.pos.y);
    scene.add(explosion);
  }
}
