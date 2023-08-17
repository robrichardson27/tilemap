import { DEBUG } from './app';
import { TileMap } from './tile-map';

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

export interface Tile {
  srcX: number;
  srcY: number;
  srcWidth: number;
  srcHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: TileType;
  outOfBounds: boolean;
}

/**
 * Gets and renders a single tile to canvas context
 */
export class TileHelper {
  static getTile(tileMap: TileMap, col: number, row: number): Tile {
    const tile = tileMap.tiles[row * tileMap.cols + col];
    if (tile) {
      return {
        srcX: tile.type * TileMap.TSize,
        srcY: 0,
        srcWidth: TileMap.TSize,
        srcHeight: TileMap.TSize,
        x: Math.round(
          (col - tileMap.startCol) * TileMap.TSize + tileMap.offsetX
        ),
        y: Math.round(
          (row - tileMap.startRow) * TileMap.TSize + tileMap.offsetY
        ),
        width: TileMap.TSize,
        height: TileMap.TSize,
        type: tile.type,
        outOfBounds: tile.outOfBounds,
      };
    }
    return <Tile>{};
  }

  static render(tileMap: TileMap, col: number, row: number) {
    const tile = TileHelper.getTile(tileMap, col, row);
    tileMap.context.drawImage(
      tileMap.tileMapImage,
      tile.srcX,
      tile.srcY,
      tile.srcWidth,
      tile.srcHeight,
      tile.x,
      tile.y,
      tile.width,
      tile.height
    );
    if (DEBUG.enabled) TileHelper.debug(tileMap, tile);
  }

  static debug(tileMap: TileMap, tile: Tile) {
    if (tile.type !== undefined) {
      tileMap.context.beginPath();
      tileMap.context.lineWidth = 1;
      tileMap.context.strokeStyle = 'rgba(255, 0, 0, 0.2)';
      tileMap.context.strokeRect(tile.x, tile.y, TileMap.TSize, TileMap.TSize);
      tileMap.context.closePath();
      tileMap.context.font = '12px sans-serif';
      tileMap.context.fillStyle = 'purple';
      tileMap.context.fillText(tile.type + '', tile.x, tile.y + 12);
    }
    if (tile.outOfBounds) {
      tileMap.context.beginPath();
      tileMap.context.fillStyle = 'rgba(255, 0, 0, 0.2)';
      tileMap.context.fillRect(tile.x, tile.y, TileMap.TSize, TileMap.TSize);
      tileMap.context.closePath();
    }
  }
}
