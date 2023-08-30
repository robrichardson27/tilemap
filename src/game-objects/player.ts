import { Canvas } from '../canvas';
import { TileMap } from '../tile-map';
import { GameObject, GameObjectUpdateArguments } from './game-object';
import { Point } from '../utils';
import { Camera } from '../camera';
import { Key } from '../keyboard';
import { Mouse } from '../mouse';
import { AnimationController } from '../animation-controller';
import idleImgSrc from '../../assets/player-idle.png';
import walkDownImgSrc from '../../assets/player-walk-down.png';
import walkRightImgSrc from '../../assets/player-walk-right.png';
import walkLeftImgSrc from '../../assets/player-walk-left.png';
import walkUpImgSrc from '../../assets/player-walk-up.png';
import attackDownImgSrc from '../../assets/player-attack-down.png';
import attackUpImgSrc from '../../assets/player-attack-up.png';
import attackLeftImgSrc from '../../assets/player-attack-left.png';
import attackRightImgSrc from '../../assets/player-attack-right.png';

export interface PlayerOptions {
  start: Point;
  camera: Camera;
  background: TileMap;
  mouse: Mouse;
}

/**
 * Render a player game object
 */
export class Player extends GameObject {
  static PlayerId = 'player';
  static FarEdgeDistFactor = 0.75;
  static NearEdgeDistFactor = 0.25;

  private get isWalking(): boolean {
    return this.dirX !== 0 || this.dirY !== 0;
  }

  private isAttacking = false;

  private defaultSpriteOptions = { width: 128, height: 128 };
  private walkSpriteOptions = {
    duration: 4,
    srcX: 23,
    srcY: 28,
    speed: 10,
    offsetX: -24,
    offsetY: -3,
  };
  private idle = new AnimationController({
    srcImg: idleImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });
  private walkDown = new AnimationController({
    srcImg: walkDownImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });
  private walkRight = new AnimationController({
    srcImg: walkRightImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });
  private walkLeft = new AnimationController({
    srcImg: walkLeftImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });
  private walkUp = new AnimationController({
    srcImg: walkUpImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });
  private attackSpriteOptions = {
    duration: 5,
    speed: 5,
  };
  private attackDown = new AnimationController({
    srcImg: attackDownImgSrc,
    srcX: 28,
    srcY: 23,
    offsetX: -19,
    offsetY: -8,
    ...this.defaultSpriteOptions,
    ...this.attackSpriteOptions,
  });
  private attackUp = new AnimationController({
    srcImg: attackUpImgSrc,
    srcX: 24,
    srcY: 0,
    offsetX: -24,
    offsetY: -31,
    ...this.defaultSpriteOptions,
    ...this.attackSpriteOptions,
  });
  private attackLeft = new AnimationController({
    srcImg: attackLeftImgSrc,
    srcX: 7,
    srcY: 3,
    offsetX: -41,
    offsetY: -28,
    ...this.defaultSpriteOptions,
    ...this.attackSpriteOptions,
  });
  private attackRight = new AnimationController({
    srcImg: attackRightImgSrc,
    srcX: 24,
    srcY: 1,
    offsetX: -24,
    offsetY: -30,
    ...this.defaultSpriteOptions,
    ...this.attackSpriteOptions,
  });

  constructor(options: PlayerOptions) {
    super({
      id: Player.PlayerId,
      hide: false,
      layer: 1,
      x: options.start.x,
      y: options.start.y,
      width: 34,
      height: 46,
      camera: options.camera,
      background: options.background,
      stats: {
        speed: 2,
        health: 3,
        attackPower: 1,
        attackSpeed: 10,
      },
    });
    this.debugColor = [255, 0, 0];
    options.mouse.click$.subscribe(() => {
      this.attack();
    });
  }

  render(context: CanvasRenderingContext2D) {
    this.renderCharacter(context);
    this.renderShadow(context);
  }

  update(args: GameObjectUpdateArguments) {
    this.dirX = this.dirY = 0;
    // Update direction based on keys selected
    if (args.keyboard.isDown(Key.Left)) {
      this.dirX = -1;
    }
    if (args.keyboard.isDown(Key.Right)) {
      this.dirX = 1;
    }
    if (args.keyboard.isDown(Key.Up)) {
      this.dirY = -1;
    }
    if (args.keyboard.isDown(Key.Down)) {
      this.dirY = 1;
    }
    this.move();
    // Update camera when character is near edge
    this.updateCamera();
    // Clamp values so they don't extend grid
    this.clampValues();
    // TODO: add attacking bounding box and collision logic
  }

  private attack() {
    this.isAttacking = true;
  }

  private renderCharacter(context: CanvasRenderingContext2D) {
    const pos: Point = {
      x: this.x - this.camera.x,
      y: this.y - this.camera.y,
    };
    if (this.isAttacking) {
      this.renderAttackAnimation(context, pos);
    } else if (this.isWalking) {
      this.renderWalkAnimation(context, pos);
    } else {
      this.renderIdleAnimation(context, pos);
    }
  }

  private renderIdleAnimation(context: CanvasRenderingContext2D, pos: Point) {
    this.idle.render(context, pos);
  }

  private renderWalkAnimation(context: CanvasRenderingContext2D, pos: Point) {
    let animation = this.walkDown;

    if (this.dirX === 1) {
      animation = this.walkRight;
    } else if (this.dirX === -1) {
      animation = this.walkLeft;
    } else if (this.dirY === -1) {
      animation = this.walkUp;
    }

    animation.render(context, pos);
  }

  private renderAttackAnimation(context: CanvasRenderingContext2D, pos: Point) {
    let animation = this.attackDown;

    if (this.dirX === 1) {
      animation = this.attackRight;
    } else if (this.dirX === -1) {
      animation = this.attackLeft;
    } else if (this.dirY === -1) {
      animation = this.attackUp;
    }

    const finished = animation.render(context, pos);

    if (finished) {
      this.isAttacking = false;
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
}
