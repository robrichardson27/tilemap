import { Camera } from '../camera';
import { Canvas, CanvasLayer, CanvasLayerOptions } from '../canvas';
import { Keyboard } from '../keyboard';
import { Tile, TileHelper, TileType } from '../tile-maps/tile';
import { TileMap } from '../tile-maps/tile-map';
import { TileMaps } from '../tile-maps/tile-maps';
import {
  Point,
  Rectangle,
  RgbArray,
  Vector,
  rgbArrayOpacity,
  rgbArrayToString,
} from '../utils';
import { aabbCollision } from './collision';
import { GameObjectData, GameObjectType, GameObjects } from './game-objects';

export interface GameObjectOptions extends CanvasLayerOptions {
  /**
   * The concrete class name for the game object
   */
  type: GameObjectType;
  /**
   * The x-axis coordinate in the destination canvas at which
   * to place the top-left corner of the source image
   */
  x: number;
  /**
   * The y-axis coordinate in the destination canvas at which
   * to place the top-left corner of the source image
   */
  y: number;
  /**
   * Width of sprite
   */
  width: number;
  /**
   * Height of sprite
   */
  height: number;
  /**
   * Current game camera object
   */
  camera: Camera;
  /**
   * Used for collision detection with background tilemaps
   */
  tileMaps?: TileMaps;
  /**
   * Various stats
   */
  stats?: GameObjectStats;
}

/**
 * Various properties - need to refactor to use ECS
 */
export interface GameObjectStats {
  /**
   * Speed multiplyer
   */
  speed: number;
  /**
   * Health
   */
  health: number;
  /**
   * Amount of damage this object can inflict to health
   */
  attackPower: number;
  /**
   * Frequency of damage this object can inflict to health 100s ms
   */
  attackSpeed: number;
}

export interface GameObjectUpdateArguments {
  gameObjects: GameObjects;
  keyboard: Keyboard;
  tick: number;
  canvas: Canvas;
}

export abstract class GameObject extends Rectangle implements CanvasLayer {
  id: string;
  hide: boolean;
  layer: number;
  tileMaps: TileMaps;
  dirX: number = 0;
  dirY: number = 0;
  debugColor: RgbArray = [255, 0, 0];
  vector: Vector;
  stats: GameObjectStats;
  prev!: Rectangle;
  type: GameObjectType;

  get pos(): Point {
    return { x: this.x - this.camera.x, y: this.y - this.camera.y };
  }

  protected camera: Camera;

  private touchingTiles: Tile[] = [];
  private outOfBoundsTiles: Tile[] = [];

  constructor(options: GameObjectOptions) {
    super(options.x, options.y, options.width, options.height);
    this.id = options.id;
    this.hide = options.hide;
    this.layer = options.layer;
    this.camera = options.camera;
    this.tileMaps = options.tileMaps ?? <TileMaps>{};
    this.stats = options.stats ?? <GameObjectStats>{};
    this.vector = new Vector(this.center, this.center);
    this.type = options.type;
  }

  abstract render(
    context: CanvasRenderingContext2D,
    tick?: number | undefined
  ): void;
  abstract update(args: GameObjectUpdateArguments): void;

  /**
   * Move the game object and detect collision with background tiles
   */
  protected move() {
    // Store previous position
    this.prev = new Rectangle(this.x, this.y, this.width, this.height);
    // Move character x
    this.x += this.dirX * this.stats.speed;
    // Detect collision
    let collides = this.checkTileMapsForCollision();
    // React to collision
    if (collides) {
      this.x = this.prev.x;
    }
    // Move character y
    this.y += this.dirY * this.stats.speed;
    // Detect collision
    collides = this.checkTileMapsForCollision();
    // React to collision
    if (collides) {
      this.y = this.prev.y;
    }
    // Store movement vector
    this.vector = new Vector(this.prev.center, this.center);
  }

  protected clampValues() {
    this.x = Math.max(
      0,
      Math.min(this.x, Canvas.Width - this.width + this.camera.x)
    );
    this.y = Math.max(
      0,
      Math.min(this.y, Canvas.Height - this.height + this.camera.y)
    );
  }

  private checkTileMapsForCollision(): boolean {
    let collides = false;
    for (let i = 0; i < this.tileMaps.array.length; i++) {
      collides = this.collisionDetection(this.tileMaps.array[i]);
      if (collides) return true;
    }
    return false;
  }

  private collisionDetection(tileMap: TileMap): boolean {
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
        const tile = TileHelper.getTile(tileMap, c, r);
        this.touchingTiles.push(tile);
        if (tile.type === TileType.OutOfBounds) {
          this.outOfBoundsTiles.push(tile);
        }
      }
    }

    let collides = false;

    // AABB collision detection
    this.outOfBoundsTiles.forEach((tile) => {
      collides = aabbCollision(this, tile, this.camera);
    });

    // TODO: move collision detection for other game objects here

    return collides;
  }

  debug(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.strokeStyle = rgbArrayToString(this.debugColor);
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
      context.strokeStyle = rgbArrayToString(this.debugColor);
      context.lineWidth = 1;
      this.touchingTiles.forEach((tile, index) => {
        context.strokeRect(tile.x, tile.y, TileMap.TSize, TileMap.TSize);
        context.font = '12px sans-serif';
        context.fillStyle = rgbArrayToString(this.debugColor);
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
      context.fillStyle = rgbArrayToString(
        rgbArrayOpacity(this.debugColor, 0.3)
      );
      this.outOfBoundsTiles.forEach((tile) => {
        context.fillRect(tile.x, tile.y, TileMap.TSize, TileMap.TSize);
      });
      context.closePath();
    }
  }

  export(): GameObjectData {
    return {
      pos: { x: this.x, y: this.y },
      type: this.type,
      width: this.width,
      height: this.height,
    };
  }
}
