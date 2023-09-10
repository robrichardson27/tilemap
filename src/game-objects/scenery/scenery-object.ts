import { GameObject, GameObjectOptions } from '../game-object';

export interface SceneryObjectOptions extends GameObjectOptions {
  renderX: number;
  renderY: number;
  renderWidth: number;
  renderHeight: number;
}

export class SceneryObject extends GameObject {
  sceneryOptions: SceneryObjectOptions;

  // TODO: update collision detection for scenery
  constructor(options: SceneryObjectOptions) {
    super(options);
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
