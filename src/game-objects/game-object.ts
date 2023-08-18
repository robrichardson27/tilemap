import { Camera } from '../camera';
import { CanvasLayer, CanvasLayerOptions } from '../canvas';
import { TileMap } from '../tile-map';
import { Point, Rectangle } from '../utils';

export interface GameObjectOptions extends CanvasLayerOptions {
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
   * The x-axis coordinate of the top left corner of the sub-rectangle
   * of the source image to draw into the destination context
   */
  srcX: number;
  /**
   * The y-axis coordinate of the top left corner of the sub-rectangle
   * of the source image to draw into the destination context
   */
  srcY: number;
  /**
   * Current game camera object
   */
  camera: Camera;
  /**
   * Source sprite image use `.png`
   */
  imgSrc: any;
  /**
   * Used for collision detection with environment
   */
  background: TileMap;
  /**
   * Speed multiplyer
   */
  speed: number;
}

export interface GameObjectUpdateArguments {
  gameObjects?: Map<string, GameObject>;
  dirX?: number;
  dirY?: number;
}

export abstract class GameObject extends CanvasLayer {
  x: number;
  y: number;
  width: number;
  height: number;
  srcX: number;
  srcY: number;
  center!: Point;
  boundingRect!: Rectangle;
  img: HTMLImageElement;
  background: TileMap;
  speed: number;

  protected camera: Camera;

  constructor(options: GameObjectOptions) {
    super(options);
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.srcX = options.srcX;
    this.srcY = options.srcY;
    this.camera = options.camera;
    this.img = new Image();
    this.img.src = options.imgSrc;
    this.background = options.background;
    this.speed = options.speed;
    this.updateCenterPoint();
  }

  abstract update(args: GameObjectUpdateArguments): void;

  updateCenterPoint() {
    this.center = {
      x: this.x + Math.floor(this.width / 2),
      y: this.y + Math.floor(this.height / 2),
    };
  }

  updateBoundingRect() {
    this.boundingRect = new Rectangle(this.x, this.y, this.width, this.height);
  }
}
