import * as v from "@valibot/valibot";

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

const ConnectionClosedScheme = v.object({
  type: v.literal("CONNECTION_CLOSED"),
  socketId: v.string(),
});
export type ConnectionClosedData = v.InferOutput<typeof ConnectionClosedScheme>;

export const MessageVariantsScheme = v.variant("type", [
  ConnectionAcceptedScheme,
  NewConnectionScheme,
  ConnectionClosedScheme,
  ObsoleteConnectionScheme,
]);
export type ObsoleteConnectionData = v.InferOutput<
  typeof ObsoleteConnectionScheme
>;

export const PlayerMoveScheme = v.object({
  type: v.literal("PLAYER_MOVE"),
  playerId: v.string(),
  pos: v.object({
    x: v.number(),
    y: v.number(),
  }),
});
export type PlayerMoveData = v.InferOutput<typeof PlayerMoveScheme>;
