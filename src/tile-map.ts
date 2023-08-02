import { Camera } from './camera';
import { TileHelper } from './tile';
import { getRandomInt } from './utils';

export enum TileType {
  Empty = -1,
  Grass = 0,
  Sand = 1,
  TreeTrunk = 2,
  TreeTop = 3,
  Bush = 4,
}

/**
 * TileMap holds enum for tile types and helper to get a tile
 */
export class TileMap {
  static Cols = 10;
  static Rows = 10;
  static TSize = 64;

  static total(): number {
    return TileMap.Cols * TileMap.Rows;
  }

  static generateBackground(): TileMap {
    const map: number[] = [];
    for (let i = 0; i < TileMap.total(); i++) {
      // Generate Grass or Sand tile
      map.push(getRandomInt(2));
    }
    return new TileMap(map);
  }

  static generateForeground(): TileMap {
    const map: number[] = [];
    let treeTrunkIndexes: number[] = [];
    for (let i = 0; i < TileMap.total(); i++) {
      if (i === treeTrunkIndexes[0]) {
        // Generate TreeTrunk
        map.push(TileType.TreeTrunk);
        treeTrunkIndexes.shift();
      } else {
        // Generate Bush, TreeTop or Empty tile
        const n = getRandomInt(5);
        switch (n) {
          case TileType.Bush:
            map.push(TileType.Bush);
            break;
          case TileType.TreeTop:
            map.push(TileType.TreeTop);
            // If top we need to place trunk on next row
            treeTrunkIndexes.push(i + TileMap.Cols);
            break;
          default:
            map.push(TileType.Empty);
        }
      }
    }
    return new TileMap(map);
  }

  tiles: number[];
  context!: CanvasRenderingContext2D;
  tileImage!: HTMLImageElement;
  startCol!: number;
  endCol!: number;
  startRow!: number;
  endRow!: number;
  offsetX!: number;
  offsetY!: number;

  constructor(tiles: number[]) {
    this.tiles = tiles;
  }

  renderMap(
    context: CanvasRenderingContext2D,
    tileImage: HTMLImageElement,
    camera: Camera
  ) {
    this.context = context;
    this.tileImage = tileImage;
    this.startCol = Math.floor(camera.x / TileMap.TSize);
    this.endCol = this.startCol + camera.width / TileMap.TSize + 1;
    this.startRow = Math.floor(camera.y / TileMap.TSize);
    this.endRow = this.startRow + camera.height / TileMap.TSize + 1;
    this.offsetX = -camera.x + this.startCol * TileMap.TSize;
    this.offsetY = -camera.y + this.startRow * TileMap.TSize;

    for (let c = this.startCol; c < this.endCol; c++) {
      for (let r = this.startRow; r < this.endRow; r++) {
        TileHelper.renderTile(this, c, r);
      }
    }
  }
}
