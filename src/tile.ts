import { Game } from './game';
import { TileMap, TileType } from './tile-map';

export interface Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
  targetWidth: number;
  targetHeight: number;
  type: TileType;
}

/**
 * Gets and renders a single tile to canvas context
 */
export class TileHelper {
  static getTile(tileMap: TileMap, col: number, row: number): Tile {
    return {
      x: tileMap.tiles[row * TileMap.Cols + col] * TileMap.TSize,
      y: 0,
      width: TileMap.TSize,
      height: TileMap.TSize,
      targetX: Math.round(
        (col - tileMap.startCol) * TileMap.TSize + tileMap.offsetX
      ),
      targetY: Math.round(
        (row - tileMap.startRow) * TileMap.TSize + tileMap.offsetY
      ),
      targetWidth: TileMap.TSize,
      targetHeight: TileMap.TSize,
      type: tileMap.tiles[row * TileMap.Cols + col],
    };
  }

  static renderTile(tileMap: TileMap, col: number, row: number) {
    const tile = TileHelper.getTile(tileMap, col, row);
    tileMap.context.drawImage(
      tileMap.tileImage,
      tile.x,
      tile.y,
      tile.width,
      tile.height,
      tile.targetX,
      tile.targetY,
      tile.targetWidth,
      tile.targetHeight
    );
    if (Game.Debug) TileHelper.debug(tileMap, tile);
  }

  static debug(tileMap: TileMap, tile: Tile) {
    tileMap.context.font = '12px sans-serif';
    tileMap.context.fillStyle = 'cyan';
    tileMap.context.fillText(
      `${tile.targetX}, ${tile.targetY}`,
      tile.targetX,
      tile.targetY + 12
    );
  }
}
