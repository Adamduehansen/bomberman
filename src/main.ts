import "./style.css";
import * as ex from "excalibur";
import * as v from "valibot";
import {
  ClientMessageVariantsScheme,
  type ConnectionClosedData,
  type InitPlayerData,
  type PlayerPositionData,
  type SpawnBombData,
} from "../message-types.ts";
import { Bomb } from "./actors/bomb.ts";
import { loader } from "./resources.ts";
import { Player } from "./actors/player.ts";
import { Enemy } from "./actors/enemy.ts";

const PosScheme = v.object({
  x: v.number(),
  y: v.number(),
});

let connected = false;
let socketId: string;

const game = new ex.Engine({
  width: 600,
  height: 600,
  maxFps: 60,
  suppressPlayButton: true,
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

await game.start(loader);

// ===== Socket stuff =====
const ws = new WebSocket("ws://localhost:8000/ws");
ws.addEventListener("open", () => {
  console.log("Connection open from game!");
  connected = true;
});
ws.addEventListener("close", () => {
  console.log("Connection closed!");
  connected = false;
});
ws.addEventListener("error", (event) => {
  console.log("Could not get connection to server", event);
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
      const otherPlayer = new Enemy({
        name: playerId,
        pos: ex.vec(x, y),
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
        otherPlayer = new Enemy({
          name: playerId,
          pos: ex.vec(pos.x, pos.y),
        });
        game.add(otherPlayer);
      } else {
        otherPlayer.pos = ex.vec(pos.x, pos.y);
      }

      break;
    }
    case "SPAWN_BOMB": {
      const { pos } = output;
      game.add(
        new Bomb({
          pos: ex.vec(pos.x, pos.y),
        }),
      );

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

game.currentScene.on("c_spawnbomb", (event) => {
  const { success, output: spawnBombPos } = v.safeParse(
    PosScheme,
    event,
  );
  if (success === false) {
    return;
  }

  game.add(
    new Bomb({
      pos: ex.vec(spawnBombPos.x, spawnBombPos.y),
    }),
  );

  const data: SpawnBombData = {
    type: "SPAWN_BOMB",
    socketId: socketId,
    pos: {
      x: spawnBombPos.x,
      y: spawnBombPos.y,
    },
  };
  ws.send(JSON.stringify(data));
});

// Event handling
player.events.on("c_moving", () => {
  const data: PlayerPositionData = {
    type: "PLAYER_POSITION",
    playerId: socketId,
    pos: {
      x: player.pos.x,
      y: player.pos.y,
    },
  };

  if (ws.readyState !== ws.OPEN) {
    return;
  }

  ws.send(JSON.stringify(data));
});
