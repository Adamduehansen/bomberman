import * as ex from "excalibur";

type AnimationMap<AnimationKey extends string> = Record<
  AnimationKey,
  ex.Graphic
>;

export class AnimationsComponent<AnimationKey extends string>
  extends ex.Component {
  #animationMap: AnimationMap<AnimationKey>;

  constructor(animationMap: AnimationMap<AnimationKey>) {
    super();

    this.#animationMap = animationMap;
  }

  set(key: AnimationKey) {
    this.owner?.get(ex.GraphicsComponent).use(this.#animationMap[key]);
  }
}
