import { Camera } from './camera';
import { Canvas } from './canvas';
import { Game } from './game';
import { Tile, TileHelper } from './tile';
import { TileMap, TileType } from './tile-map';

/**
 * Render a character
 */
export class Character {
  static Speed = 2;
  static SrcX = 0;
  static SrcY = 0;
  static Width = 64;
  static Height = 64;
  static MaxX = Canvas.Width - Character.Width;
  static MaxY = Canvas.Height - Character.Height;
  static FarEdgeDistFactor = 0.75;
  static NearEdgeDistFactor = 0.25;

  x: number;
  y: number;
  context: CanvasRenderingContext2D;
  debugContext: CanvasRenderingContext2D;
  camera: Camera;
  tileMap: TileMap;
  touchingTiles: Tile[] = [];
  wallTiles: Tile[] = [];

  constructor(x: number, y: number, game: Game) {
    this.x = x;
    this.y = y;
    this.context = game.context;
    this.debugContext = game.debugContext;
    this.camera = game.camera;
    this.tileMap = game.tileMaps[1];
  }

  render(img: HTMLImageElement) {
    this.context.drawImage(
      img,
      Character.SrcX,
      Character.SrcY,
      Character.Width,
      Character.Height,
      this.x - this.camera.x,
      this.y - this.camera.y,
      Character.Width,
      Character.Height
    );
    if (Game.Debug) {
      this.debug();
    }
  }

  update(dirX: number, dirY: number) {
    // Store previous position
    const prev = { x: this.x, y: this.y };
    // Move character x
    this.x += dirX * Character.Speed;
    // Detect collision
    let collides = this.collisionDetection();
    // React to collision
    if (collides) {
      this.x = prev.x;
      this.y = prev.y;
    }
    prev.x = this.x;
    prev.y = this.y;
    // Move character y
    this.y += dirY * Character.Speed;
    // Detect collision
    collides = this.collisionDetection();
    // React to collision
    if (collides) {
      this.x = prev.x;
      this.y = prev.y;
    }
    // Update camera when character is near edge
    this.updateCamera();
    // Clamp values so they don't extend grid
    this.clampValues();
  }

  private updateCamera() {
    if (
      this.x + Character.Width >
      this.camera.x + Canvas.Width * Character.FarEdgeDistFactor
    ) {
      this.camera.update(1, 0);
    }
    if (this.x - this.camera.x < Canvas.Width * Character.NearEdgeDistFactor) {
      this.camera.update(-1, 0);
    }
    if (
      this.y + Character.Height >
      this.camera.y + Canvas.Height * Character.FarEdgeDistFactor
    ) {
      this.camera.update(0, 1);
    }
    if (this.y - this.camera.y < Canvas.Height * Character.NearEdgeDistFactor) {
      this.camera.update(0, -1);
    }
  }

  private clampValues() {
    this.x = Math.max(0, Math.min(this.x, Character.MaxX + this.camera.x));
    this.y = Math.max(0, Math.min(this.y, Character.MaxY + this.camera.y));
  }

  private collisionDetection(): boolean {
    const startCol = Math.floor(this.x / TileMap.TSize);
    const endCol = Math.ceil((this.x + Character.Width) / TileMap.TSize);
    const startRow = Math.floor(this.y / TileMap.TSize);
    const endRow = Math.ceil((this.y + Character.Height) / TileMap.TSize);

    // Tiles character is in
    this.touchingTiles = [];
    // Wall tiles character cannot pass through
    this.wallTiles = [];

    for (let c = startCol; c < endCol; c++) {
      for (let r = startRow; r < endRow; r++) {
        const tile = TileHelper.getTile(this.tileMap, c, r);
        this.touchingTiles.push(tile);
        if (tile.type === TileType.TreeTrunk) {
          this.wallTiles.push(tile);
        }
      }
    }

    let collides = false;

    // AABB collision detection
    this.wallTiles.forEach((tile) => {
      let xCollides =
        this.x - this.camera.x < tile.x + TileMap.TSize &&
        this.x - this.camera.x + Character.Width > tile.x;
      let yCollides =
        this.y - this.camera.y < tile.y + TileMap.TSize &&
        this.y - this.camera.y + Character.Height > tile.y;
      collides = xCollides && yCollides;
    });

    return collides;
  }

  private debug() {
    this.debugContext.beginPath();
    this.debugContext.strokeStyle = 'red';
    this.debugContext.lineWidth = 1;
    this.debugContext.strokeRect(
      this.x - this.camera.x,
      this.y - this.camera.y,
      Character.Width,
      Character.Height
    );
    this.debugContext.closePath();
    if (this.touchingTiles && this.touchingTiles.length) {
      this.debugContext.beginPath();
      this.debugContext.strokeStyle = 'yellow';
      this.debugContext.lineWidth = 1;
      this.touchingTiles.forEach((tile, index) => {
        this.debugContext.strokeRect(
          tile.x,
          tile.y,
          TileMap.TSize,
          TileMap.TSize
        );
        this.debugContext.font = '12px sans-serif';
        this.debugContext.fillStyle = 'yellow';
        this.debugContext.fillText(
          index + '',
          tile.x + TileMap.TSize / 2,
          tile.y + TileMap.TSize / 2
        );
      });
      this.debugContext.closePath();
    }
    if (this.wallTiles && this.wallTiles.length) {
      this.debugContext.beginPath();
      this.debugContext.fillStyle = 'rgba(255, 0, 0, 0.3)';
      this.wallTiles.forEach((tile) => {
        this.debugContext.fillRect(
          tile.x,
          tile.y,
          TileMap.TSize,
          TileMap.TSize
        );
      });
      this.debugContext.closePath();
    }
  }
}
