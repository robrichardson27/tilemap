import { Camera } from './camera';
import { Canvas } from './canvas';
import { Game } from './game';
import { Tile, TileHelper } from './tile';
import { TileMap, TileType } from './tile-map';

/**
 * Render a character
 */
export class Character {
  static Speed = 1;
  static SrcX = 0;
  static SrcY = 0;
  static Width = 64;
  static Height = 64;
  static MaxX = Canvas.Width - Character.Width;
  static MaxY = Canvas.Height - Character.Height;

  x: number;
  y: number;
  context: CanvasRenderingContext2D;
  touchingTiles: Tile[] = [];

  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.context = context;
  }

  render(img: HTMLImageElement) {
    this.context.drawImage(
      img,
      Character.SrcX,
      Character.SrcY,
      Character.Width,
      Character.Height,
      this.x,
      this.y,
      Character.Width,
      Character.Height
    );
    if (Game.Debug) {
      this.context.beginPath();
      this.context.strokeStyle = 'red';
      this.context.strokeRect(
        this.x,
        this.y,
        Character.Width,
        Character.Height
      );
      this.context.closePath();
      if (this.touchingTiles && this.touchingTiles.length) {
        this.context.beginPath();
        this.context.strokeStyle = 'yellow';
        this.touchingTiles.forEach((tile, index) => {
          this.context.strokeRect(
            tile.targetX,
            tile.targetY,
            TileMap.TSize,
            TileMap.TSize
          );
          this.context.font = '12px sans-serif';
          this.context.fillStyle = 'yellow';
          this.context.fillText(
            index + '',
            tile.targetX + TileMap.TSize / 2,
            tile.targetY + TileMap.TSize / 2
          );
        });
        this.context.closePath();
      }
    }
  }

  move(dirX: number, dirY: number, camera: Camera) {
    // Adjust speed when camera stops following character
    let speed = this.adjustSpeed(camera);
    // Move character
    this.x += dirX * speed;
    this.y += dirY * speed;
    // Clamp values so they don't extend grid
    this.x = Math.max(0, Math.min(this.x, Character.MaxX));
    this.y = Math.max(0, Math.min(this.y, Character.MaxY));
    if (Game.Debug) this.debug();
  }

  canMove(
    dirX: number,
    dirY: number,
    tileMap: TileMap,
    camera: Camera
  ): boolean {
    const charX = camera.x + this.x;
    const charY = camera.y + this.y;
    const minCol = Math.floor(charX / TileMap.TSize);
    const minRow = Math.floor(charY / TileMap.TSize);
    const maxCol = Math.ceil(charX / TileMap.TSize);
    const maxRow = Math.ceil(charY / TileMap.TSize);

    this.touchingTiles = [
      TileHelper.getTile(tileMap, minCol, minRow),
      TileHelper.getTile(tileMap, maxCol, minRow),
      TileHelper.getTile(tileMap, minCol, maxRow),
      TileHelper.getTile(tileMap, maxCol, maxRow),
    ];

    // Add buffer around character to ignore collision
    const cE1 = this.touchingTiles[1].targetY + TileMap.TSize - this.y > 10;
    const cE2 = this.y + Character.Height - this.touchingTiles[3].targetY > 10;
    const cW1 = this.touchingTiles[0].targetY + TileMap.TSize - this.y > 10;
    const cW2 = this.y + Character.Height - this.touchingTiles[2].targetY > 10;
    const cS1 = this.touchingTiles[2].targetX + TileMap.TSize - this.x > 10;
    const cS2 = this.x + Character.Height - this.touchingTiles[3].targetX > 10;
    const cN1 = this.touchingTiles[0].targetX + TileMap.TSize - this.x > 10;
    const cN2 = this.x + Character.Height - this.touchingTiles[1].targetX > 10;

    // Check East
    if (dirX === 1) {
      if (
        (this.touchingTiles[1].type === TileType.TreeTrunk && cE1) ||
        (this.touchingTiles[3].type === TileType.TreeTrunk && cE2)
      ) {
        return false;
      }
    }
    // Check West
    if (dirX === -1) {
      if (
        (this.touchingTiles[0].type === TileType.TreeTrunk && cW1) ||
        (this.touchingTiles[2].type === TileType.TreeTrunk && cW2)
      ) {
        return false;
      }
    }
    // Check South
    if (dirY === 1) {
      if (
        (this.touchingTiles[2].type === TileType.TreeTrunk && cS1) ||
        (this.touchingTiles[3].type === TileType.TreeTrunk && cS2)
      ) {
        return false;
      }
    }
    // Check North
    if (dirY === -1) {
      if (
        (this.touchingTiles[0].type === TileType.TreeTrunk && cN1) ||
        (this.touchingTiles[1].type === TileType.TreeTrunk && cN2)
      ) {
        return false;
      }
    }
    return true;
  }

  private adjustSpeed(camera: Camera): number {
    let speed = Character.Speed;
    // Increase is difference between speeds
    const speedDif = Camera.Speed - Character.Speed;
    // Character is East
    if (
      camera.x + camera.width === camera.maxX + Canvas.Width &&
      this.x + Character.Width !== Canvas.Width
    ) {
      speed += speedDif;
    }
    // Character is West
    if (camera.x === 0 && this.x !== 0) {
      speed += speedDif;
    }
    // Character is South
    if (
      camera.y + camera.height === camera.maxY + Canvas.Height &&
      this.y + Character.Height !== Canvas.Height
    ) {
      speed += speedDif;
    }
    // Character is North
    if (camera.y === 0 && this.y !== 0) {
      speed += speedDif;
    }
    return speed;
  }

  debug() {
    const character = document.getElementById('character') as HTMLPreElement;
    character.innerHTML = `
      <p>Character: { x: ${this.x}, y: ${this.y}, x2: ${
      this.x + Character.Width
    }, y2: ${this.y + Character.Height} }</p>
    `;
  }
}
