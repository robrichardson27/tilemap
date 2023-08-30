import { TileMap } from '../tile-map';
import { Player } from './player';
import { Circle, degToRad, rgbArrayOpacity, rgbArrayToString } from '../utils';
import {
  GameObject,
  GameObjectOptions,
  GameObjectUpdateArguments,
} from './game-object';
import { aabbCollision, circleInRectangle } from './collision';

export abstract class Monster extends GameObject {
  detectionRadius = 100;
  detectionCircle!: Circle;

  private characterDetected = false;
  private img: HTMLImageElement;
  srcX: number;
  srcY: number;

  constructor(options: GameObjectOptions) {
    super(options);
    this.img = new Image();
    this.img.src = options.imgSrc as string;
    this.srcX = options.srcX as number;
    this.srcY = options.srcY as number;
    this.setDetectionCircle();
    this.debugColor = [0, 128, 0];
  }

  update(args: GameObjectUpdateArguments) {
    if (args.gameObjects) {
      const player = args.gameObjects.get(Player.PlayerId);
      if (player) {
        // Move monster if player detected
        this.detectPlayer(player);
        // Collision detection with background tiles
        this.move();
        // Collision detection with other game objects
        this.gameObjectsCollisionDetection(args);
        // Clamp values so they don't extend grid
        this.clampValues();
      }
    }
    this.setDetectionCircle();
  }

  render(context: CanvasRenderingContext2D, tick: number) {
    this.renderMonster(context, tick);
    this.renderShadow(context);
  }

  private doDamage = false;

  private gameObjectsCollisionDetection(args: GameObjectUpdateArguments) {
    args.gameObjects.forEach((object) => {
      // Skip self
      if (object.id === this.id) {
        return;
      }
      // Detect if object collides with another
      const collides = aabbCollision(this, object);
      if (collides) {
        if (object.id === Player.PlayerId) {
          // Reduce player health on collision
          this.attackPlayer(object as Player, args.tick);
        } else {
          // Move monster by simply reversing the vector
          this.x += -this.vector.x;
          this.y += -this.vector.y;
        }
      }
    });
  }

  private attackPlayer(player: Player, tick: number) {
    const freq = tick % this.stats.attackSpeed;
    if (freq === 0 && this.doDamage) {
      this.doDamage = false;
      player.stats.health -= this.stats.attackPower;
    } else if (freq !== 0) {
      this.doDamage = true;
    }
  }

  private setDetectionCircle() {
    this.detectionCircle = new Circle(this.center, this.detectionRadius);
  }

  private detectPlayer(player: GameObject) {
    // Is player within detection radius?
    this.characterDetected = circleInRectangle(this.detectionCircle, player);
    this.dirX = this.dirY = 0;
    if (this.characterDetected) {
      if (this.x <= player.x - this.width) {
        this.dirX += 1;
      } else if (this.x >= player.x + player.width) {
        this.dirX -= 1;
      }
      if (this.y <= player.y - this.height) {
        this.dirY += 1;
      } else if (this.y >= player.y + player.height) {
        this.dirY -= 1;
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

  override debug(context: CanvasRenderingContext2D): void {
    super.debug(context);
    context.beginPath();
    context.arc(
      this.center.x - this.camera.x,
      this.center.y - this.camera.y,
      this.detectionRadius,
      degToRad(0),
      degToRad(360)
    );
    context.stroke();
    if (this.characterDetected) {
      context.fillStyle = rgbArrayToString(
        rgbArrayOpacity(this.debugColor, 0.2)
      );
      context.fill();
    }
    if (this.vector) {
      context.beginPath();
      context.moveTo(
        this.center.x - this.camera.x,
        this.center.y - this.camera.y
      );
      context.lineTo(
        this.center.x - this.camera.x + this.vector.x * 50,
        this.center.y - this.camera.y + this.vector.y * 50
      );
      context.stroke();
    }
  }
}
