import { TileMap } from './tile-maps/tile-map';

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
    cols: number,
    rows: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxX = cols * TileMap.TSize - width;
    this.maxY = rows * TileMap.TSize - height;
  }

  update(dirX: number, dirY: number, speed: number) {
    // Move camera
    this.x += dirX * speed;
    this.y += dirY * speed;
    // Clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
  }
}
