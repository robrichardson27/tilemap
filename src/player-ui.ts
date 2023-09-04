import { CanvasLayer } from './canvas';
import { Player } from './game-objects/player/player';
import heathImgSrc from '../assets/sprites/health.png';
import heathHalfImgSrc from '../assets/sprites/health-half.png';

/**
 * Basic UI for player
 */
export class PlayerUi implements CanvasLayer {
  id: string = 'player-ui';
  hide: boolean = false;
  layer: number = 0;

  private player: Player;
  private healthImg: HTMLImageElement;
  private healthHalfImg: HTMLImageElement;

  get playerHealth(): number {
    return this.player.stats.health;
  }

  constructor(player: Player) {
    this.player = player;
    this.healthImg = new Image();
    this.healthImg.src = heathImgSrc;
    this.healthHalfImg = new Image();
    this.healthHalfImg.src = heathHalfImgSrc;
  }

  render(context: CanvasRenderingContext2D): void {
    const fullHearts = Math.floor(this.playerHealth);
    const halfHeart = this.playerHealth % 1 > 0;
    for (let i = 0; i < fullHearts; i++) {
      const dx = 10 + i * 42;
      context.drawImage(this.healthImg, 0, 0, 32, 32, dx, 10, 32, 32);
      if (halfHeart) {
        this.drawHalfHeart(context, dx + 42);
      }
    }
    if (fullHearts === 0 && halfHeart) {
      this.drawHalfHeart(context, 10);
    }
  }

  private drawHalfHeart(context: CanvasRenderingContext2D, dx: number) {
    context.drawImage(this.healthHalfImg, 0, 0, 32, 32, dx, 10, 32, 32);
  }

  debug(context: CanvasRenderingContext2D): void {
    context.font = '24px sans-serif';
    context.fillText('Health: ' + this.player.stats.health, 10, 34 + 32);
  }
}
