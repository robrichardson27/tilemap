import { Game } from './game';
import { TileMap } from './tile-map';

/**
 * Contains information regarding to the Camera's position and viewport
 */
export class Camera {
  static Speed = 2;

  x: number;
  y: number;
  width: number;
  height: number;
  maxX: number;
  maxY: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxX = TileMap.Cols * TileMap.TSize - width;
    this.maxY = TileMap.Rows * TileMap.TSize - height;
  }

  move(dirX: number, dirY: number) {
    // Move camera
    this.x += dirX * Camera.Speed;
    this.y += dirY * Camera.Speed;
    // Clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
    if (Game.Debug) this.debug();
  }

  debug() {
    const camera = document.getElementById('camera') as HTMLPreElement;
    camera.innerHTML = `
      <p>Camera: { x: ${this.x}, y: ${this.y} }, { x: ${
      this.x + this.width
    }, y: ${this.y + this.height} }</p>
    `;
  }
}
