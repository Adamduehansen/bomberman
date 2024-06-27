import { ImageSource, Loader, Sound, SpriteSheet } from "excalibur";
import map from "./Map.ts";

export const Resources = {
  spriteSheet: new ImageSource("sprites/spritesheet.png"),
  spriteSheetTransparent: new ImageSource(
    "sprites/spritesheet_transparent.png",
  ),
  explosion1: new Sound("sounds/explosion1.wav"),
  explosion2: new Sound("sounds/explosion2.wav"),
  death: new Sound("sounds/death.wav"),
  balloonExplode: new Sound("sounds/balloon-explode.wav"),
  upgrade: new Sound("sounds/upgrade.wav"),
} as const;

export const loader = new Loader([map.tiledMap]);

for (const resource of Object.values(Resources)) {
  loader.addResource(resource);
}

export const spriteSheet = SpriteSheet.fromImageSource({
  image: Resources.spriteSheetTransparent,
  grid: {
    columns: 16,
    rows: 23,
    spriteHeight: 16,
    spriteWidth: 16,
  },
});
