import { Point } from '../utils';

export interface AnimationOptions {
  /**
   * Number of frames the animation lasts for
   */
  duration: number;
  /**
   * Source animation file
   */
  srcImg: string;
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
   * Pixel offset for sprite x-axis
   */
  offsetX?: number;
  /**
   * Pixel offset for sprite y-axis
   */
  offsetY?: number;
  /**
   * Width of sprite
   */
  width: number;
  /**
   * Height of sprite
   */
  height: number;
  /**
   * Speed of animation, greater number = slower
   */
  speed: number;
}

export class AnimationController {
  private duration: number;
  private tickCount = 0;
  private currentFrameCount = 0;
  private img = new Image();
  private srcX: number;
  private srcY: number;
  private offsetX: number;
  private offsetY: number;
  private width: number;
  private height: number;
  private speed: number;

  get currentFrame(): number {
    return this.currentFrameCount;
  }

  constructor(options: AnimationOptions) {
    this.duration = options.duration;
    this.img.src = options.srcImg;
    this.srcX = options.srcX;
    this.srcY = options.srcY;
    this.width = options.width;
    this.height = options.height;
    this.speed = options.speed;
    this.offsetX = options.offsetX ?? 0;
    this.offsetY = options.offsetY ?? 0;
  }

  /**
   * Returns true once animation has finished
   * @param tick
   * @returns
   */
  render(context: CanvasRenderingContext2D, pos: Point): boolean {
    const x = this.srcX + this.width * this.currentFrameCount;

    context.drawImage(
      this.img,
      x,
      this.srcY,
      this.width,
      this.height,
      pos.x + this.offsetX,
      pos.y + this.offsetY,
      this.width,
      this.height
    );

    let finished = false;
    this.tickCount++;

    if (this.tickCount > this.speed) {
      this.currentFrameCount++;
      this.tickCount = 0;
    }

    if (this.currentFrameCount >= this.duration) {
      this.currentFrameCount = 0;
      finished = true;
    }

    return finished;
  }
}
