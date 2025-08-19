import * as ex from "excalibur";
import { Bomberman } from "./bomberman.ts";
import { Resources } from "../resources.ts";

interface Args {
  name: string;
  pos: ex.Vector;
}

export class Enemy extends Bomberman {
  constructor(args: Args) {
    super({
      name: args.name,
      pos: args.pos,
      spriteSheetImageSource: Resources.img.enemy,
    });

    this.on("kill", () => {
      this.body.collisionType = ex.CollisionType.Passive;
      this.animations.set("die");
    });
  }
}
