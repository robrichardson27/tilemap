import { Camera } from './camera';
import { TileHelper } from './tile';

export enum TileType {
  Empty = -1,
  Grass = 0,
  GrassSand = 5,
  Sand = 1,
  SandSea1 = 2,
  SandSea2 = 4,
  Sea = 3,
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

  // TODO: Replace with levels loaded from source or level editor
  static generateBackground(): TileMap {
    const map: number[] = [
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
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

  render(
    context: CanvasRenderingContext2D,
    tileImage: HTMLImageElement,
    camera: Camera
  ) {
    this.context = context;
    this.tileImage = tileImage;
    this.startCol = Math.floor(camera.x / TileMap.TSize);
    this.endCol = Math.ceil(this.startCol + camera.width / TileMap.TSize);
    this.startRow = Math.floor(camera.y / TileMap.TSize);
    this.endRow = Math.ceil(this.startRow + camera.height / TileMap.TSize);
    this.offsetX = -camera.x + this.startCol * TileMap.TSize;
    this.offsetY = -camera.y + this.startRow * TileMap.TSize;

    for (let c = this.startCol; c <= this.endCol; c++) {
      for (let r = this.startRow; r <= this.endRow; r++) {
        TileHelper.render(this, c, r);
      }
    }
  }
}
