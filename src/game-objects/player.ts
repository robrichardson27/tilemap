import { Canvas } from '../canvas';
import { Tile, TileHelper } from '../tile';
import { TileMap } from '../tile-map';
import { DEBUG } from '../app';
import {
  GameObject,
  GameObjectOptions,
  GameObjectUpdateArguments,
} from './game-object';
import { Point } from '../utils';
import { Camera } from '../camera';
import playerImgSrc from '../../assets/player.png';

/**
 * Render a player game object
 */
export class Player extends GameObject {
  static PlayerId = 'player';
  /**
   * Creates the player
   * @param start
   * @param camera
   * @param tileMap
   * @returns
   */
  static createPlayer(
    start: Point,
    camera: Camera,
    background: TileMap
  ): Player {
    const player = new Player({
      id: Player.PlayerId,
      hide: false,
      layer: 0,
      x: start.x,
      y: start.y,
      width: 34,
      height: 46,
      srcX: 1,
      srcY: 1,
      camera: camera,
      imgSrc: playerImgSrc,
      background: background,
      speed: 2,
    });
    return player;
  }

  static FarEdgeDistFactor = 0.75;
  static NearEdgeDistFactor = 0.25;

  private dirX?: number;
  private dirY?: number;
  private touchingTiles: Tile[] = [];
  private outOfBoundsTiles: Tile[] = [];

  constructor(options: GameObjectOptions) {
    super(options);
    this.updateBoundingRect();
  }

  render(context: CanvasRenderingContext2D, tick: number) {
    this.renderCharacter(context, tick);
    this.renderShadow(context);
    if (DEBUG.enabled) {
      this.debug(context);
    }
  }

  update(args: GameObjectUpdateArguments) {
    if (args.dirX !== undefined && args.dirY !== undefined) {
      // Store direction for animation
      this.dirX = args.dirX;
      this.dirY = args.dirY;
      // Store previous position
      const prev = { x: this.x, y: this.y };
      // Move character x
      this.x += args.dirX * this.speed;
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
      this.y += args.dirY * this.speed;
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
      // Update bounding rect
      this.updateBoundingRect();
    }
  }

  private renderCharacter(context: CanvasRenderingContext2D, tick: number) {
    // TODO: re-do character sprite so that each direction is separate sprite and 64x64
    const tickOffset = tick % 4;
    let imgSrcXOffset = this.srcX;
    let imgSrcYOffset = this.srcY;
    if (this.dirX || this.dirY) {
      imgSrcYOffset *= this.height * tickOffset + tickOffset + 1;
    }
    if (this.dirX === 1) {
      imgSrcXOffset += this.width + 1;
    } else if (this.dirX === -1) {
      imgSrcXOffset += this.width * 3 + 3;
    } else if (this.dirY === -1) {
      imgSrcXOffset += this.width * 2 + 2;
    }
    context.drawImage(
      this.img,
      imgSrcXOffset,
      imgSrcYOffset,
      this.width,
      this.height,
      this.x - this.camera.x,
      this.y - this.camera.y,
      this.width,
      this.height
    );
  }

  private renderShadow(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.ellipse(
      this.x - this.camera.x + this.width / 2,
      this.y - this.camera.y + this.height - 2,
      this.width / 2 - 5,
      5,
      0,
      0,
      180
    );
    context.fill();
  }

  private updateCamera() {
    if (
      this.x + this.width >
      this.camera.x + Canvas.Width * Player.FarEdgeDistFactor
    ) {
      this.camera.update(1, 0, this.speed);
    }
    if (this.x - this.camera.x < Canvas.Width * Player.NearEdgeDistFactor) {
      this.camera.update(-1, 0, this.speed);
    }
    if (
      this.y + this.height >
      this.camera.y + Canvas.Height * Player.FarEdgeDistFactor
    ) {
      this.camera.update(0, 1, this.speed);
    }
    if (this.y - this.camera.y < Canvas.Height * Player.NearEdgeDistFactor) {
      this.camera.update(0, -1, this.speed);
    }
  }

  private clampValues() {
    this.x = Math.max(
      0,
      Math.min(this.x, Canvas.Width - this.width + this.camera.x)
    );
    this.y = Math.max(
      0,
      Math.min(this.y, Canvas.Height - this.height + this.camera.y)
    );
  }

  private collisionDetection(): boolean {
    const startCol = Math.floor(this.x / TileMap.TSize);
    const endCol = Math.ceil((this.x + this.width) / TileMap.TSize);
    const startRow = Math.floor(this.y / TileMap.TSize);
    const endRow = Math.ceil((this.y + this.height) / TileMap.TSize);

    // Tiles character is in
    this.touchingTiles = [];
    // Tiles character cannot pass through
    this.outOfBoundsTiles = [];

    for (let c = startCol; c < endCol; c++) {
      for (let r = startRow; r < endRow; r++) {
        const tile = TileHelper.getTile(this.background, c, r);
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
        this.x - this.camera.x + this.width > tile.x;
      let yCollides =
        this.y - this.camera.y < tile.y + TileMap.TSize &&
        this.y - this.camera.y + this.height > tile.y;
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
      this.width,
      this.height
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
