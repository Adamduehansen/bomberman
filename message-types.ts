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

export const MessageVariantsScheme = v.variant("type", [
  ConnectionAcceptedScheme,
  NewConnectionScheme,
]);
