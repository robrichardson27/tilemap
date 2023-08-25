import { Canvas } from '../canvas';
import { TileMap } from '../tile-map';
import { GameObject, GameObjectUpdateArguments } from './game-object';
import { Point } from '../utils';
import { Camera } from '../camera';
import playerImgSrc from '../../assets/player.png';
import playerAttackImgSrc from '../../assets/player-attack.png';
import { Key } from '../keyboard';

/**
 * Render a player game object
 */
export class Player extends GameObject {
  static PlayerId = 'player';
  static FarEdgeDistFactor = 0.75;
  static NearEdgeDistFactor = 0.25;

  private isAttacking = false;
  private attackImg = new Image();

  constructor(start: Point, camera: Camera, background: TileMap) {
    super({
      id: Player.PlayerId,
      hide: false,
      layer: 1,
      x: start.x,
      y: start.y,
      width: 34,
      height: 46,
      srcX: 1,
      srcY: 1,
      camera: camera,
      imgSrc: playerImgSrc,
      background: background,
      stats: {
        speed: 2,
        health: 10,
        attackPower: 1,
        attackSpeed: 10,
      },
    });
    this.debugColor = [255, 0, 0];
    window.addEventListener('click', () => {
      this.attack();
    });
    this.attackImg.src = playerAttackImgSrc;
  }

  render(context: CanvasRenderingContext2D, tick: number) {
    this.renderCharacter(context, tick);
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
  }

  private attack() {
    console.log('ATTACK');
    console.log(this);
    this.isAttacking = true;
  }

  private renderCharacter(context: CanvasRenderingContext2D, tick: number) {
    // TODO: re-do character sprite so that each direction is separate sprite and 64x64
    if (!this.isAttacking) {
      const tickOffset = tick % 4;
      let imgSrcXOffset = this.srcX;
      let imgSrcYOffset = this.srcY;
      if (this.dirX || this.dirY) {
        imgSrcYOffset *= this.height * tickOffset + tickOffset + 1;
      }
      if (this.dirX === 1) {
        imgSrcXOffset += this.width + 1;
      } else if (this.dirX === -1) {
        imgSrcXOffset += this.width * 3 + 3;
      } else if (this.dirY === -1) {
        imgSrcXOffset += this.width * 2 + 2;
      }
      context.drawImage(
        this.img,
        imgSrcXOffset,
        imgSrcYOffset,
        this.width,
        this.height,
        this.x - this.camera.x,
        this.y - this.camera.y,
        this.width,
        this.height
      );
    } else {
      // Render attack animation
      const tickOffset = tick % 5;
      this.attackAnimationMap[tickOffset] = 1;
      if (!this.attackAnimationMap.includes(0)) {
        this.isAttacking = false;
        this.attackAnimationMap = [0, 0, 0, 0, 0];
      }
      context.drawImage(
        this.attackImg,
        tickOffset * 64,
        0,
        64,
        64,
        this.x - this.camera.x,
        this.y - this.camera.y,
        64,
        64
      );
      console.log(this.attackAnimationMap);
    }
  }

  private attackAnimationMap = [0, 0, 0, 0, 0];

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
