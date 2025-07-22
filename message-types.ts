import * as v from "valibot";

// Common handled schemes.
export const SpawnBombScheme = v.object({
  type: v.literal("SPAWN_BOMB"),
  socketId: v.string(),
  pos: v.object({
    x: v.number(),
    y: v.number(),
  }),
});
export type SpawnBombData = v.InferOutput<typeof SpawnBombScheme>;

// Client handled schemes
const ConnectionAcceptedScheme = v.object({
  type: v.literal("CONNECTION_ACCEPTED"),
  socketId: v.string(),
  otherPlayers: v.array(v.object({
    id: v.string(),
  })),
});

const ObsoleteConnectionScheme = v.object({
  type: v.literal("OBSOLETE_CONNECTION"),
  playerId: v.string(),
});
export type ObsoleteConnectionData = v.InferOutput<
  typeof ObsoleteConnectionScheme
>;

const InitPlayerForPlayersScheme = v.object({
  type: v.literal("INIT_PLAYERS_FOR_PLAYER"),
  player: v.object({
    playerId: v.string(),
    x: v.number(),
    y: v.number(),
  }),
});
export type InitPlayerForPlayersData = v.InferOutput<
  typeof InitPlayerForPlayersScheme
>;

const PlayerSetPosition = v.object({
  type: v.literal("PLAYER_SET_POSITION"),
  playerId: v.string(),
  pos: v.object({
    x: v.number(),
    y: v.number(),
  }),
});
export type PlayerSetPosition = v.InferOutput<typeof PlayerSetPosition>;

export const ClientMessageVariantsScheme = v.variant("type", [
  ConnectionAcceptedScheme,
  ObsoleteConnectionScheme,
  InitPlayerForPlayersScheme,
  PlayerSetPosition,
  SpawnBombScheme,
]);

// Server handled schemes.
export const PlayerPositionScheme = v.object({
  type: v.literal("PLAYER_POSITION"),
  playerId: v.string(),
  pos: v.object({
    x: v.number(),
    y: v.number(),
  }),
});
export type PlayerPositionData = v.InferOutput<typeof PlayerPositionScheme>;

const ConnectionClosedScheme = v.object({
  type: v.literal("CONNECTION_CLOSED"),
  socketId: v.string(),
});
export type ConnectionClosedData = v.InferOutput<typeof ConnectionClosedScheme>;

const InitPlayerScheme = v.object({
  type: v.literal("INIT_PLAYER"),
  socketId: v.string(),
  pos: v.object({
    x: v.number(),
    y: v.number(),
  }),
});
export type InitPlayerData = v.InferOutput<typeof InitPlayerScheme>;

export const ServerMessageVariantsScheme = v.variant("type", [
  PlayerPositionScheme,
  ConnectionClosedScheme,
  InitPlayerScheme,
  SpawnBombScheme,
]);
