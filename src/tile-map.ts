import { Camera } from './camera';
import { TileHelper } from './tile';

export enum TileType {
  Empty = -1,
  BeachBL = 0,
  BeachB = 1,
  BeachBR = 2,
  BeachR = 3,
  BeachTR = 4,
  BeachT = 5,
  BeachTL = 6,
  BeachL = 7,
  ShoreBL = 8,
  ShoreB = 9,
  ShoreBR = 10,
  ShoreR = 11,
  ShoreTR = 12,
  ShoreT = 13,
  ShoreTL = 14,
  ShoreL = 15,
  Sea = 16,
  Sand = 17,
  Sand2 = 18,
  GrassSandBL = 19,
  GrassSandB = 20,
  GrassSandBR = 21,
  GrassSandR = 22,
  GrassSandTR = 23,
  GrassSandT = 24,
  GrassSandTL = 25,
  GrassSandL = 26,
  GrassEmpty = 27,
  GrassPlant = 28,
  GrassBlades = 29,
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
      16, 16, 11, 3, 17, 17, 17, 18, 17, 26, 16, 16, 11, 3, 17, 17, 17, 17, 18,
      26, 16, 16, 11, 3, 17, 18, 17, 18, 17, 26, 9, 9, 10, 3, 18, 17, 17, 17,
      18, 26, 1, 1, 1, 2,
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
