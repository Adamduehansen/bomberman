import * as ex from "excalibur";

export const BombCollisonGroup = ex.CollisionGroupManager.create("bombGroup");
export const ExplosionCollisionGroup = ex.CollisionGroupManager.create(
  "explosionGroup",
);
