import * as ex from "excalibur";
import { TiledResource } from "@excaliburjs/plugin-tiled";

export const Resources = {
  img: {
    player: new ex.ImageSource("/sprites/player-spritesheet.png"),
    enemy: new ex.ImageSource("/sprites/enemy-spritesheet.png"),
    bomb: new ex.ImageSource("/sprites/bomb-spritesheet.png"),
    explosion: new ex.ImageSource("/sprites/explosion-spritesheet.png"),
  },
  map: {
    map1: new TiledResource("/maps/map-1.tmx"),
  },
} as const;

export const loader = new ex.Loader([
  ...Object.values(Resources.img),
  ...Object.values(Resources.map),
]);
