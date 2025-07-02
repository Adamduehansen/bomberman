import { TiledResource } from "@excaliburjs/plugin-tiled";
import { vec } from "excalibur";

class Map {
  tiledMap: TiledResource;

  constructor(pathToMap: string) {
    this.tiledMap = new TiledResource(pathToMap, {
      entityClassNameFactories: {},
    });
  }

  isWallAt(x: number, y: number): boolean {
    return this.tiledMap.getTileByPoint("walls", vec(x, y)) !== null;
  }
}

const map = new Map("maps/map1.tmx");

export default map;
