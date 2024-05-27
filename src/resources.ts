import { ImageSource, Loader, SpriteSheet } from "excalibur";
import { TiledResource } from "@excaliburjs/plugin-tiled";

export const Resources = {
  spriteSheet: new ImageSource("sprites/spritesheet.png"),
  spriteSheetTransparent: new ImageSource(
    "sprites/spritesheet_transparent.png",
  ),
} as const;

export const tiledMap = new TiledResource("maps/map1.tmx");

export const loader = new Loader([tiledMap]);

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
