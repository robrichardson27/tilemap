import { TileMap } from '../../tile-maps/tile-map';
import { Player } from '../player/player';
import {
  Circle,
  degToRad,
  rgbArrayOpacity,
  rgbArrayToString,
} from '../../utils';
import {
  GameObject,
  GameObjectOptions,
  GameObjectUpdateArguments,
} from '../game-object';
import { aabbCollision, circleInRectangle } from '../collision';
import { playPlayerPainAudio } from '../player/player-audio';

export abstract class Monster extends GameObject {
  private detectionRadius = 100;
  private detectionCircle!: Circle;
  private doDamage = false;
  private characterDetected = false;

  constructor(options: GameObjectOptions) {
    super(options);
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
      }
    }
    this.setDetectionCircle();
  }

  render(context: CanvasRenderingContext2D, tick: number) {
    this.renderMonster(context, tick);
    if (this.characterDetected) this.renderHealth(context);
  }

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
      // Knock player back
      player.x += this.vector.x * 10;
      player.y += this.vector.y * 10;
      playPlayerPainAudio();
      player.isTakingDamage = true;
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

  private renderHealth(context: CanvasRenderingContext2D) {
    context.fillStyle = rgbArrayToString([216, 10, 10]);
    const width = this.stats.health;
    context.fillRect(
      this.d.x - this.camera.x,
      this.d.y - this.camera.y,
      width,
      5
    );
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
