import { DEBUG } from '../app';
import { TileMap } from '../tile-map';
import { Player } from './player';
import { Circle, Point, circleInRectangle, degToRad } from '../utils';
import {
  GameObject,
  GameObjectOptions,
  GameObjectUpdateArguments,
} from './game-object';
import { Camera } from '../camera';
import blobImgSrc from '../../assets/blob.png';

export class Monster extends GameObject {
  detectionRadius = 100;
  detectionCircle!: Circle;

  private characterDetected = false;

  // TODO: move to blob class
  static BlobId = 'blob';
  /**
   * Create a blob monster
   */
  static createBlob(
    id: string,
    start: Point,
    camera: Camera,
    background: TileMap
  ): Monster {
    const monster = new Monster({
      id: id,
      hide: false,
      layer: 1,
      x: start.x,
      y: start.y,
      width: 28,
      height: 36,
      srcX: 18,
      srcY: 9,
      camera: camera,
      imgSrc: blobImgSrc,
      background: background,
      speed: 1,
    });
    return monster;
  }

  constructor(options: GameObjectOptions) {
    super(options);
    this.setDetectionCircle();
  }

  update(args: GameObjectUpdateArguments) {
    if (args.gameObjects) {
      const player = args.gameObjects.get(Player.PlayerId);
      if (player) {
        this.move(player);
      }
    }
    this.updateCenterPoint();
    this.setDetectionCircle();
  }

  render(context: CanvasRenderingContext2D, tick: number) {
    this.renderMonster(context, tick);
    this.renderShadow(context);
    if (DEBUG.enabled) {
      this.debug(context);
    }
  }

  private setDetectionCircle() {
    this.detectionCircle = new Circle(this.center, this.detectionRadius);
  }

  private move(player: GameObject) {
    // Is player within detection radius?
    this.characterDetected = circleInRectangle(
      this.detectionCircle,
      player.boundingRect
    );
    if (this.characterDetected) {
      if (this.x < player.x - player.width) {
        this.x += 1;
      } else if (this.x > player.x + player.width) {
        this.x -= 1;
      }
      if (this.y < player.y - player.height) {
        this.y += 1;
      } else if (this.y > player.y + player.height) {
        this.y -= 1;
      }
    }
  }

  private renderMonster(context: CanvasRenderingContext2D, tick: number) {
    const tickOffset = tick % 4;
    const imgSrcXOffset = this.srcX + tickOffset * TileMap.TSize;
    context.drawImage(
      this.img,
      imgSrcXOffset,
      this.srcY,
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
      this.center.x - this.camera.x,
      this.y - this.camera.y + this.height - 2,
      this.width / 2,
      5,
      0,
      0,
      180
    );
    context.fill();
  }

  private debug(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.strokeStyle = 'green';
    context.lineWidth = 1;
    context.strokeRect(
      this.x - this.camera.x,
      this.y - this.camera.y,
      this.width,
      this.height
    );
    context.arc(
      this.center.x - this.camera.x,
      this.center.y - this.camera.y,
      this.detectionRadius,
      degToRad(0),
      degToRad(360)
    );
    context.stroke();
    if (this.characterDetected) {
      context.fillStyle = 'rgba(0, 128, 0, 0.2)';
      context.fill();
    }
  }
}
