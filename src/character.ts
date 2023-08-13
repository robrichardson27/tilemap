import { Camera } from './camera';
import { Canvas, CanvasLayer, CanvasLayerOptions } from './canvas';
import { Tile, TileHelper } from './tile';
import { TileMap } from './tile-map';
import charImgSrc from '../assets/character.png';
import { Key, Keyboard } from './keyboard';
import { DEBUG } from './app';

export interface CharacterOptions extends CanvasLayerOptions {
  x: number;
  y: number;
  camera: Camera;
  tileMap: TileMap;
  tick: number;
  keyboard: Keyboard;
}

/**
 * Render a character
 */
export class Character extends CanvasLayer {
  static Speed = 2;
  static SrcX = 1;
  static SrcY = 1;
  static Width = 34;
  static Height = 46;
  static MaxX = Canvas.Width - Character.Width;
  static MaxY = Canvas.Height - Character.Height;
  static FarEdgeDistFactor = 0.75;
  static NearEdgeDistFactor = 0.25;

  private x: number;
  private y: number;
  private camera: Camera;
  private tileMap: TileMap;
  private touchingTiles: Tile[] = [];
  private outOfBoundsTiles: Tile[] = [];
  private characterImg: HTMLImageElement;
  private tick: number;
  private keyboard: Keyboard;

  constructor(options: CharacterOptions) {
    super(options);
    this.x = options.x;
    this.y = options.y;
    this.camera = options.camera;
    this.tileMap = options.tileMap;
    this.tick = options.tick;
    this.keyboard = options.keyboard;
    this.characterImg = new Image();
    this.characterImg.src = charImgSrc;
  }

  render(context: CanvasRenderingContext2D) {
    this.renderCharacter(context);
    this.renderShadow(context);
    if (DEBUG.enabled) {
      this.debug(context);
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

  private renderCharacter(context: CanvasRenderingContext2D) {
    const tickOffset = this.tick % 4;
    let imgSrcXOffset = Character.SrcX;
    let imgSrcYOffset = Character.SrcY;
    if (this.keyboard.isAnyDown([Key.Up, Key.Down, Key.Left, Key.Right])) {
      imgSrcYOffset *= Character.Height * tickOffset + tickOffset + 1;
    }
    if (this.keyboard.isDown(Key.Right)) {
      imgSrcXOffset += Character.Width + 1;
    } else if (this.keyboard.isDown(Key.Left)) {
      imgSrcXOffset += Character.Width * 3 + 3;
    } else if (this.keyboard.isDown(Key.Up)) {
      imgSrcXOffset += Character.Width * 2 + 2;
    }
    context.drawImage(
      this.characterImg,
      imgSrcXOffset,
      imgSrcYOffset,
      Character.Width,
      Character.Height,
      this.x - this.camera.x,
      this.y - this.camera.y,
      Character.Width,
      Character.Height
    );
  }

  private renderShadow(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.ellipse(
      this.x - this.camera.x + Character.Width / 2,
      this.y - this.camera.y + Character.Height - 2,
      Character.Width / 2 - 5,
      5,
      0,
      0,
      180
    );
    context.fill();
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
    // Tiles character cannot pass through
    this.outOfBoundsTiles = [];

    for (let c = startCol; c < endCol; c++) {
      for (let r = startRow; r < endRow; r++) {
        const tile = TileHelper.getTile(this.tileMap, c, r);
        this.touchingTiles.push(tile);
        if (tile.outOfBounds) {
          this.outOfBoundsTiles.push(tile);
        }
      }
    }

    let collides = false;

    // AABB collision detection
    this.outOfBoundsTiles.forEach((tile) => {
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

  // TODO: sort out debug layer!
  private debug(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.strokeStyle = 'red';
    context.lineWidth = 1;
    context.strokeRect(
      this.x - this.camera.x,
      this.y - this.camera.y,
      Character.Width,
      Character.Height
    );
    context.closePath();
    if (this.touchingTiles && this.touchingTiles.length) {
      context.beginPath();
      context.strokeStyle = 'red';
      context.lineWidth = 1;
      this.touchingTiles.forEach((tile, index) => {
        context.strokeRect(tile.x, tile.y, TileMap.TSize, TileMap.TSize);
        context.font = '12px sans-serif';
        context.fillStyle = 'red';
        context.fillText(
          index + '',
          tile.x + TileMap.TSize / 2,
          tile.y + TileMap.TSize / 2
        );
      });
      context.closePath();
    }
    if (this.outOfBoundsTiles && this.outOfBoundsTiles.length) {
      context.beginPath();
      context.fillStyle = 'rgba(255, 0, 0, 0.3)';
      this.outOfBoundsTiles.forEach((tile) => {
        context.fillRect(tile.x, tile.y, TileMap.TSize, TileMap.TSize);
      });
      context.closePath();
    }
  }
}
