import * as ex from "excalibur";

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
