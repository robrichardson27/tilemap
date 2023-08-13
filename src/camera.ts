import { Character } from './character';
import { TileMap } from './tile-map';

/**
 * Contains information regarding to the Camera's position and viewport
 */
export class Camera {
  x: number;
  y: number;
  width: number;
  height: number;
  maxX: number;
  maxY: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    tileMap: TileMap
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxX = tileMap.cols * TileMap.TSize - width;
    this.maxY = tileMap.rows * TileMap.TSize - height;
  }

  update(dirX: number, dirY: number) {
    // Move camera
    this.x += dirX * Character.Speed;
    this.y += dirY * Character.Speed;
    // Clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
  }
}
