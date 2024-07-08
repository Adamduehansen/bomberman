import { Actor, ActorArgs, Sprite, vec } from "excalibur";
import { Resources } from "../resources.ts";

export default class Points extends Actor {
  constructor(args: ActorArgs) {
    super({
      ...args,
      width: 16,
      height: 8,
      z: 20,
    });
  }

  onInitialize(): void {
    this.graphics.use(
      new Sprite({
        image: Resources.spriteSheetTransparent,
        sourceView: {
          x: 16 * 7,
          y: 16 * 21,
          width: 16,
          height: 8,
        },
      }),
    );
    this.actions.moveBy(vec(0, -10), 10).fade(0, 500).die();
  }
}
