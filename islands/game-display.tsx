import { useEffect } from "preact/hooks";
import * as ex from "excalibur";
import { JSX } from "preact";
import {
  ConnectionClosedData,
  MessageVariantsScheme,
  PlayerMoveData,
} from "../message-types.ts";
import * as v from "@valibot/valibot";

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
      this.events.emit("moving");
    } else if (this.#controls.isHeld("left")) {
      this.vel.x = -PLAYER_SPEED;
      this.events.emit("moving");
    } else {
      this.vel.x = 0;
    }
    if (this.#controls.isHeld("up")) {
      this.vel.y = -PLAYER_SPEED;
      this.events.emit("moving");
    } else if (this.#controls.isHeld("down")) {
      this.vel.y = PLAYER_SPEED;
      this.events.emit("moving");
    } else {
      this.vel.y = 0;
    }
  }
}

async function initGame(): Promise<void> {
  let connected = false;
  let socketId: string;

  // ===== Socket stuff =====
  const ws = new WebSocket("/ws");
  ws.addEventListener("open", () => {
    console.log("Connection open from game!");
    connected = true;
  });
  ws.addEventListener("message", ({ data }) => {
    console.log("DEBUG: Socket message received:", data);

    const { success, output, issues } = v.safeParse(
      MessageVariantsScheme,
      JSON.parse(data),
    );
    if (success === false) {
      console.warn("Unhandled type", data);
      console.warn(issues);
      return;
    }

    switch (output.type) {
      case "CONNECTION_ACCEPTED": {
        socketId = output.socketId;
        break;
      }
      case "NEW_CONNECTION": {
        break;
      }
      case "OBSOLETE_CONNECTION": {
        break;
      }
    }
  });

  globalThis.addEventListener("beforeunload", () => {
    const data: ConnectionClosedData = {
      type: "CONNECTION_CLOSED",
      socketId: socketId,
    };
    ws.send(JSON.stringify(data));
    ws.close();
  });

  // ===== Game stuff =====
  const game = new ex.Engine({
    width: 600,
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
    pos: ex.vec(
      ex.randomInRange(50, 550),
      ex.randomInRange(50, 550),
    ),
  });
  player.events.on("moving", () => {
    const data: PlayerMoveData = {
      type: "PLAYER_MOVE",
      playerId: socketId,
      pos: {
        x: player.pos.x,
        y: player.pos.y,
      },
    };
    ws.send(JSON.stringify(data));
  });

  game.add(player);

  await game.start();
}

export default function GameDisplay(): JSX.Element {
  useEffect(() => {
    initGame();
  }, []);
  return <canvas id="root"></canvas>;
}
