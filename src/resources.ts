import { ImageSource, Loader, SpriteSheet } from "excalibur";
import map from "./Map.ts";

export const Resources = {
  spriteSheet: new ImageSource("sprites/spritesheet.png"),
  spriteSheetTransparent: new ImageSource(
    "sprites/spritesheet_transparent.png",
  ),
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
