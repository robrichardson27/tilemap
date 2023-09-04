import { GameObject, GameObjectOptions } from '../game-object';

export interface SceneryObjectOptions extends GameObjectOptions {
  renderX: number;
  renderY: number;
  renderWidth: number;
  renderHeight: number;
}

export class SceneryObject extends GameObject {
  // TODO: refactor to use AnimationContoller
  private img: HTMLImageElement;
  private srcX: number;
  private srcY: number;
  private sceneryOptions: SceneryObjectOptions;

  // TODO: update collision detection for scenery
  constructor(options: SceneryObjectOptions) {
    super(options);
    this.img = new Image();
    this.img.src = options.imgSrc as string;
    this.srcX = options.srcX as number;
    this.srcY = options.srcY as number;
    this.debugColor = [255, 128, 0];
    this.sceneryOptions = options;
  }

  render(context: CanvasRenderingContext2D): void {
    context.drawImage(
      this.img,
      this.srcX,
      this.srcY,
      this.sceneryOptions.renderWidth,
      this.sceneryOptions.renderHeight,
      this.sceneryOptions.renderX - this.camera.x,
      this.sceneryOptions.renderY - this.camera.y,
      this.sceneryOptions.renderWidth,
      this.sceneryOptions.renderHeight
    );
  }

  update(): void {
    // Not implemented
  }
}
