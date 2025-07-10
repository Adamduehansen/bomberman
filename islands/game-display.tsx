import { useContext, useEffect } from "preact/hooks";
import * as ex from "excalibur";
import { JSX } from "preact";
import { Socket } from "./socket-provider.tsx";

interface PlayerArgs {
  pos: ex.Vector;
}

class ControlsComponent extends ex.Component {
  declare owner: ex.Actor;

  readonly controlSchema = {
    up: [ex.Keys.W, ex.Keys.Up],
    right: [ex.Keys.D, ex.Keys.Right],
    down: [ex.Keys.S, ex.Keys.Down],
    left: [ex.Keys.A, ex.Keys.Left],
  } as const;

  isHeld(control: keyof typeof this.controlSchema): boolean {
    const engine = this.owner?.scene?.engine;
    if (engine === undefined) {
      return false;
    }

    return engine.input.keyboard.isHeld(this.controlSchema[control][0]) ||
      engine.input.keyboard.isHeld(this.controlSchema[control][1]);
  }
}

const PLAYER_SPEED = 100;

class Player extends ex.Actor {
  #controls = new ControlsComponent();

  constructor(args: PlayerArgs) {
    super({
      pos: args.pos,
      color: ex.Color.Red,
      width: 25,
      height: 25,
    });

    this.addComponent(this.#controls);
  }

  override onPreUpdate(_engine: ex.Engine, _elapsed: number): void {
    if (this.#controls.isHeld("right")) {
      this.vel.x = PLAYER_SPEED;
    } else if (this.#controls.isHeld("left")) {
      this.vel.x = -PLAYER_SPEED;
    } else {
      this.vel.x = 0;
    }
    if (this.#controls.isHeld("up")) {
      this.vel.y = -PLAYER_SPEED;
    } else if (this.#controls.isHeld("down")) {
      this.vel.y = PLAYER_SPEED;
    } else {
      this.vel.y = 0;
    }
  }
}

async function initGame(socket: WebSocket): Promise<void> {
  let connected = false;

  socket.addEventListener("open", () => {
    console.log("Connection open from game!");
    connected = true;
  });

  const game = new ex.Engine({
    width: 800,
    height: 600,
    canvasElementId: "root",
  });

  const connectStatus = new ex.Label({
    pos: ex.vec(20, 20),
    font: new ex.Font({
      family: "impact",
      size: 24,
      unit: ex.FontUnit.Px,
    }),
  });
  connectStatus.on("predraw", () => {
    connectStatus.text = `Connection status: ${connected ? "🟢" : "🔴"}`;
  });
  game.add(connectStatus);

  const player = new Player({
    pos: ex.vec(100, 100),
  });

  game.add(player);

  await game.start();
}

export default function GameDisplay(): JSX.Element {
  const socket = useContext(Socket);

  useEffect(() => {
    if (socket === undefined) {
      return;
    }

    initGame(socket);
  }, [socket]);
  return <canvas id="root"></canvas>;
}
