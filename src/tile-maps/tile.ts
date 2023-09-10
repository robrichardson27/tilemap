import { DEBUG } from '../app';
import { TileMap } from './tile-map';
import { Rectangle } from '../utils';

export interface TileData {
  index: number;
  type: TileType;
}

export enum TileType {
  Empty = -1,
  OutOfBounds = 0,
  Walkable = 1,
}

export interface TileOptions {
  srcX: number;
  srcY: number;
  srcWidth: number;
  srcHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  type: TileType;
}

export class Tile extends Rectangle implements TileData {
  srcX: number;
  srcY: number;
  srcWidth: number;
  srcHeight: number;
  index: number;
  type: TileType;

  constructor(options: TileOptions) {
    super(options.x, options.y, options.width, options.height);
    this.srcX = options.srcX;
    this.srcY = options.srcY;
    this.srcWidth = options.srcWidth;
    this.srcHeight = options.srcHeight;
    this.index = options.index;
    this.type = options.type;
  }
}

/**
 * Gets and renders a single tile to canvas context
 */
export class TileHelper {
  static getTile(tileMap: TileMap, col: number, row: number): Tile {
    const tile = tileMap.tiles[row * tileMap.cols + col];
    if (tile) {
      return new Tile({
        srcX: tile.index * TileMap.TSize,
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
        index: tile.index,
        type: tile.type,
      });
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
    if (tile.index !== undefined) {
      tileMap.context.beginPath();
      tileMap.context.lineWidth = 1;
      tileMap.context.strokeStyle = 'rgba(255, 0, 0, 0.2)';
      tileMap.context.strokeRect(tile.x, tile.y, TileMap.TSize, TileMap.TSize);
      tileMap.context.closePath();
      tileMap.context.font = '12px sans-serif';
      tileMap.context.fillStyle = 'purple';
      tileMap.context.fillText(tile.index + '', tile.x, tile.y + 12);
    }
    if (tile.type === TileType.OutOfBounds) {
      tileMap.context.beginPath();
      tileMap.context.fillStyle = 'rgba(255, 0, 0, 0.2)';
      tileMap.context.fillRect(tile.x, tile.y, TileMap.TSize, TileMap.TSize);
      tileMap.context.closePath();
    }
  }
}
