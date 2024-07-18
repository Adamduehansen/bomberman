import { TiledResource } from "@excaliburjs/plugin-tiled";
import { vec } from "excalibur";
import DestructableWall from "./objects/DestructableWall.ts";
import BalloonEnemy from "./objects/BalloonEnemy.ts";
import LaneLengthUpgrade from "./objects/LaneLengthUpgrade.ts";
import Door from "./objects/Door.ts";

class Map {
  tiledMap: TiledResource;

  constructor(pathToMap: string) {
    this.tiledMap = new TiledResource(pathToMap, {
      entityClassNameFactories: {
        "destructable-wall": function (props) {
          return new DestructableWall({
            x: props.worldPos.x + 8,
            y: props.worldPos.y - 8,
          });
        },
        "balloon-enemy": function (props) {
          return new BalloonEnemy({
            x: props.worldPos.x + 8,
            y: props.worldPos.y - 8,
          });
        },
        "lane-length-upgrade": function (props) {
          return new LaneLengthUpgrade({
            x: props.worldPos.x + 8,
            y: props.worldPos.y - 8,
          });
        },
        "door": function (props) {
          return new Door({
            x: props.worldPos.x + 8,
            y: props.worldPos.y - 8,
          });
        },
      },
    });
  }

  isWallAt(x: number, y: number): boolean {
    return this.tiledMap.getTileByPoint("walls", vec(x, y)) !== null;
  }
}

const map = new Map("maps/map1.tmx");

export default map;
