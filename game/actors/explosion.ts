import * as ex from "excalibur";

export const ExplosionGroup = ex.CollisionGroupManager.create("explosionGroup");

export class Explosion extends ex.Actor {
  constructor() {
    super({
      name: "Explosion",
      width: 25,
      height: 25,
      color: ex.Color.Orange,
      // collisionGroup: ExplosionGroup,
      // collisionType: ex.CollisionType.Fixed,
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
}
