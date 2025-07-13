import { useEffect } from "preact/hooks";
import * as ex from "excalibur";
import { JSX } from "preact";
import {
  ClientMessageVariantsScheme,
  ConnectionClosedData,
  InitPlayerData,
  PlayerPositionData,
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
      color: ex.Color.Green,
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

  // ===== Init Game stuff =====
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
    text: "Connection status: 🔴",
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

  game.add(player);

  await game.start();

  // ===== Socket stuff =====
  const ws = new WebSocket("/ws");
  ws.addEventListener("open", () => {
    console.log("Connection open from game!");
    connected = true;
  });
  ws.addEventListener("close", () => {
    console.log("Connection closed!");
    connected = false;
  });
  ws.addEventListener("message", ({ data }) => {
    console.log("DEBUG: Socket message received:", data);

    const { success, output, issues } = v.safeParse(
      ClientMessageVariantsScheme,
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

        const data: InitPlayerData = {
          type: "INIT_PLAYER",
          socketId: socketId,
          pos: {
            x: player.pos.x,
            y: player.pos.y,
          },
        };
        ws.send(JSON.stringify(data));

        break;
      }
      case "OBSOLETE_CONNECTION": {
        const { playerId } = output;
        const obsoletePlayer = game.currentScene.actors.find((actor) =>
          actor.name === playerId
        );
        obsoletePlayer?.kill();
        break;
      }
      case "INIT_PLAYERS_FOR_PLAYER": {
        const { playerId, x, y } = output.player;
        const otherPlayer = new ex.Actor({
          width: 25,
          height: 25,
          color: ex.Color.Red,
          pos: ex.vec(x, y),
          name: playerId,
        });
        game.add(otherPlayer);

        const data: PlayerPositionData = {
          type: "PLAYER_POSITION",
          playerId: socketId,
          pos: {
            x: player.pos.x,
            y: player.pos.y,
          },
        };
        ws.send(JSON.stringify(data));

        break;
      }
      case "PLAYER_SET_POSITION": {
        const { playerId, pos } = output;
        let otherPlayer = game.currentScene.actors.find((actor) =>
          actor.name === playerId
        );

        if (otherPlayer === undefined) {
          otherPlayer = new ex.Actor({
            width: 25,
            height: 25,
            color: ex.Color.Red,
            pos: ex.vec(pos.x, pos.y),
            name: playerId,
          });
          game.add(otherPlayer);
        } else {
          otherPlayer.pos = ex.vec(pos.x, pos.y);
        }

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

  // Event handling
  player.events.on("moving", () => {
    const data: PlayerPositionData = {
      type: "PLAYER_POSITION",
      playerId: socketId,
      pos: {
        x: player.pos.x,
        y: player.pos.y,
      },
    };
    ws.send(JSON.stringify(data));
  });
}

export default function GameDisplay(): JSX.Element {
  useEffect(() => {
    initGame();
  }, []);
  return <canvas id="root"></canvas>;
}
