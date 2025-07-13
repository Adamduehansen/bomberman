import * as v from "@valibot/valibot";

// Client schemes
const ConnectionAcceptedScheme = v.object({
  type: v.literal("CONNECTION_ACCEPTED"),
  socketId: v.string(),
  otherPlayers: v.array(v.object({
    id: v.string(),
  })),
});

const NewConnectionScheme = v.object({
  type: v.literal("NEW_CONNECTION"),
  playerData: v.object({
    id: v.string(),
  }),
});

const ObsoleteConnectionScheme = v.object({
  type: v.literal("OBSOLETE_CONNECTION"),
  socketId: v.string(),
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

export const ClientMessageVariantsScheme = v.variant("type", [
  ConnectionAcceptedScheme,
  NewConnectionScheme,
  ObsoleteConnectionScheme,
  InitPlayerForPlayersScheme,
]);

// Server schemes.
export const PlayerMoveScheme = v.object({
  type: v.literal("PLAYER_MOVE"),
  playerId: v.string(),
  pos: v.object({
    x: v.number(),
    y: v.number(),
  }),
});
export type PlayerMoveData = v.InferOutput<typeof PlayerMoveScheme>;

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
  PlayerMoveScheme,
  ConnectionClosedScheme,
  InitPlayerScheme,
]);
