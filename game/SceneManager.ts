import { Engine, FadeInOut } from "excalibur";

const scenes = ["gamescene", "gameoverscene"] as const;
export type SceneName = typeof scenes[number];

export default class SceneManager {
  static goToScene(engine: Engine, name: SceneName) {
    engine.goToScene(name, {
      destinationIn: new FadeInOut({
        duration: 200,
        direction: "in",
      }),
      sourceOut: new FadeInOut({
        duration: 500,
        direction: "out",
      }),
    });
  }
}
