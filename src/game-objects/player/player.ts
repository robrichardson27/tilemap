import { Canvas } from '../../canvas';
import { GameObject, GameObjectUpdateArguments } from '../game-object';
import { Point, Rectangle, rgbArrayToString } from '../../utils';
import { Camera } from '../../camera';
import { Key } from '../../keyboard';
import { Mouse } from '../../mouse';
import { AnimationController } from '../animation-controller';
import { PlayerAnimations } from './player-animations';
import {
  attackDown,
  attackLeft,
  attackRight,
  attackUp,
} from './player-attacks';
import { aabbCollision } from '../collision';
import {
  pausePlayerRunningAudio,
  playPlayerRunningAudio,
  playPlayerSwordAudio,
} from './player-audio';
import { skip } from 'rxjs';
import { GameObjectType } from '../game-objects';
import { TileMaps } from '../../tile-maps/tile-maps';

export interface PlayerOptions {
  pos: Point;
  camera: Camera;
  tileMaps: TileMaps;
  mouse: Mouse;
}

/**
 * Render a player game object
 */
export class Player extends GameObject {
  static ID = 'player';
  static FarEdgeDistFactor = 0.75;
  static NearEdgeDistFactor = 0.25;

  attackingRect = new Rectangle(0, 0, 0, 0);
  isTakingDamage = false;

  private get isWalking(): boolean {
    return this.dirX !== 0 || this.dirY !== 0;
  }

  private isAttacking = false;

  private playerAnimations = new PlayerAnimations();
  private currentWalkAnimation!: AnimationController;
  private currentAttackAnimation!: AnimationController;

  constructor(options: PlayerOptions) {
    super({
      type: GameObjectType.Player,
      id: Player.ID,
      hide: false,
      layer: 2,
      x: options.pos.x,
      y: options.pos.y,
      width: 34,
      height: 46,
      camera: options.camera,
      tileMaps: options.tileMaps,
      stats: {
        speed: 2,
        health: 3,
        attackPower: 1,
        // Not used
        attackSpeed: 0,
      },
    });
    this.debugColor = [255, 0, 0];
    this.initMouseListener(options.mouse);
  }

  override debug(context: CanvasRenderingContext2D) {
    super.debug(context);
    context.beginPath();
    context.strokeStyle = rgbArrayToString([0, 0, 0]);
    context.lineWidth = 1;
    context.strokeRect(
      this.attackingRect.x - this.camera.x,
      this.attackingRect.y - this.camera.y,
      this.attackingRect.width,
      this.attackingRect.height
    );
    context.closePath();
  }

  render(context: CanvasRenderingContext2D) {
    this.renderShadow(context);
    this.renderCharacter(context);
  }

  update(args: GameObjectUpdateArguments) {
    this.isTakingDamage = false;
    // Reset directions
    this.dirX = this.dirY = 0;
    // Handle moving up
    if (args.keyboard.isDown(Key.Up)) {
      this.dirY = -1;
      this.currentWalkAnimation = this.playerAnimations.walkUp;
      this.currentAttackAnimation = this.playerAnimations.attackUp;
      if (this.isAttacking) {
        this.attackingRect = attackUp(
          this.currentAttackAnimation.currentFrame,
          this.center
        );
      }
    }
    // Handle moving down
    if (args.keyboard.isDown(Key.Down)) {
      this.dirY = 1;
      this.currentWalkAnimation = this.playerAnimations.walkDown;
      this.currentAttackAnimation = this.playerAnimations.attackDown;
      if (this.isAttacking) {
        this.attackingRect = attackDown(
          this.currentAttackAnimation.currentFrame,
          this.center
        );
      }
    }
    // Handle moving left
    if (args.keyboard.isDown(Key.Left)) {
      this.dirX = -1;
      this.currentWalkAnimation = this.playerAnimations.walkLeft;
      this.currentAttackAnimation = this.playerAnimations.attackLeft;
      if (this.isAttacking) {
        this.attackingRect = attackLeft(
          this.currentAttackAnimation.currentFrame,
          this.center
        );
      }
    }
    // Handle moving right
    if (args.keyboard.isDown(Key.Right)) {
      this.dirX = 1;
      this.currentWalkAnimation = this.playerAnimations.walkRight;
      this.currentAttackAnimation = this.playerAnimations.attackRight;
      if (this.isAttacking) {
        this.attackingRect = attackRight(
          this.currentAttackAnimation.currentFrame,
          this.center
        );
      }
    }
    // Handle idle attack
    if (!this.isWalking) {
      this.currentAttackAnimation = this.playerAnimations.attackDown;
      if (this.isAttacking) {
        this.attackingRect = attackDown(
          this.currentAttackAnimation.currentFrame,
          this.center
        );
      }
    }
    // Remove attacking rect
    if (!this.isAttacking) {
      this.attackingRect = new Rectangle(0, 0, 0, 0);
    }
    // Move character, includes background collision
    this.move();
    // Collision detection with other game objects
    this.gameObjectsCollisionDetection(args);
    // Update camera when character is near edge
    this.updateCamera();
    // Clamp values so they don't extend grid
    this.clampValues();
  }

  private gameObjectsCollisionDetection(args: GameObjectUpdateArguments) {
    args.gameObjects.forEach((object) => {
      // Skip self
      if (object.id === this.id) {
        return;
      }
      // Detect if player collides with another
      const collides = aabbCollision(this, object);
      if (collides) {
        // Move to prev position
        this.x = this.prev.x;
        this.y = this.prev.y;
        object.x += -object.vector.x;
        object.y += -object.vector.y;
      }
      const attack = aabbCollision(this.attackingRect, object);
      if (attack) {
        // Knock monster back
        object.x += -object.vector.x * 20;
        object.y += -object.vector.y * 20;
        object.stats.health -= this.stats.attackPower;
        if (object.stats.health < 0) {
          // Should abstract this away
          args.gameObjects.delete(object.id);
          args.canvas.removeLayer(object.id);
        }
      }
    });
  }

  private renderCharacter(context: CanvasRenderingContext2D) {
    if (this.isAttacking) {
      this.isAttacking = !this.currentAttackAnimation.render(context, this.pos);
      pausePlayerRunningAudio();
    } else if (this.isWalking) {
      this.currentWalkAnimation.render(context, this.pos);
      playPlayerRunningAudio();
    } else {
      this.playerAnimations.idle.render(context, this.pos);
      pausePlayerRunningAudio();
    }

    if (this.isTakingDamage) {
      // Show red screen flash when taking damage
      context.fillStyle = rgbArrayToString([216, 10, 10, 0.2]);
      context.fillRect(0, 0, Canvas.Width, Canvas.Height);
    }
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
      this.camera.update(1, 0, this.stats.speed);
    }
    if (this.x - this.camera.x < Canvas.Width * Player.NearEdgeDistFactor) {
      this.camera.update(-1, 0, this.stats.speed);
    }
    if (
      this.y + this.height >
      this.camera.y + Canvas.Height * Player.FarEdgeDistFactor
    ) {
      this.camera.update(0, 1, this.stats.speed);
    }
    if (this.y - this.camera.y < Canvas.Height * Player.NearEdgeDistFactor) {
      this.camera.update(0, -1, this.stats.speed);
    }
  }

  private initMouseListener(mouse: Mouse) {
    mouse.click$.pipe(skip(1)).subscribe(() => {
      this.isAttacking = true;
      playPlayerSwordAudio();
    });
  }
}
