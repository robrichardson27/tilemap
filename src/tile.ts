import { DEBUG } from './app';
import { TileMap, TileType } from './tile-map';

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
}

/**
 * Gets and renders a single tile to canvas context
 */
export class TileHelper {
  static getTile(tileMap: TileMap, col: number, row: number): Tile {
    return {
      srcX: tileMap.tiles[row * TileMap.Cols + col] * TileMap.TSize,
      srcY: 0,
      srcWidth: TileMap.TSize,
      srcHeight: TileMap.TSize,
      x: Math.round((col - tileMap.startCol) * TileMap.TSize + tileMap.offsetX),
      y: Math.round((row - tileMap.startRow) * TileMap.TSize + tileMap.offsetY),
      width: TileMap.TSize,
      height: TileMap.TSize,
      type: tileMap.tiles[row * TileMap.Cols + col],
    };
  }

  static render(tileMap: TileMap, col: number, row: number) {
    const tile = TileHelper.getTile(tileMap, col, row);
    tileMap.context.drawImage(
      tileMap.tileImage,
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
    tileMap.context.font = '12px sans-serif';
    tileMap.context.fillStyle = 'purple';
    tileMap.context.fillText(`${tile.x}, ${tile.y}`, tile.x, tile.y + 12);
  }
}
