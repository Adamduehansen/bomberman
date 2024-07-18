import { Scene } from "excalibur";
import { store } from "../store.ts";
import SceneManager from "../SceneManager.ts";

export default class GameOverScene extends Scene {
  container?: HTMLDivElement;

  onActivate(): void {
    console.log("Activating GameOverScene");

    this.container = document.createElement("div");
    this.container.style.position = "fixed";
    this.container.style.left = "50%";
    this.container.style.right = "50%";
    this.container.style.top = "50%";
    this.container.style.bottom = "50%";
    this.container.style.width = "300px";

    const scoreLabel = document.createElement("p");
    scoreLabel.textContent = `Your score is ${store.getState().score.score}!`;

    this.container.append(scoreLabel);

    const restartButton = document.createElement("button");
    restartButton.textContent = "Try again";
    restartButton.onclick = () => {
      SceneManager.goToScene(this.engine, "gamescene");
    };
    restartButton.setAttribute("autofocus", "");
    this.container.append(restartButton);

    document.body.append(this.container);
  }

  onDeactivate(): void {
    this.container!.remove();
  }
}
