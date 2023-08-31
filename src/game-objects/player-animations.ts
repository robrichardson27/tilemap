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

export class PlayerAnimations {
  defaultSpriteOptions = { width: 128, height: 128 };
  walkSpriteOptions = {
    duration: 4,
    srcX: 23,
    srcY: 28,
    speed: 10,
    offsetX: -24,
    offsetY: -3,
  };

  idle = new AnimationController({
    srcImg: idleImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });

  walkDown = new AnimationController({
    srcImg: walkDownImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });
  walkRight = new AnimationController({
    srcImg: walkRightImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });
  walkLeft = new AnimationController({
    srcImg: walkLeftImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });
  walkUp = new AnimationController({
    srcImg: walkUpImgSrc,
    ...this.defaultSpriteOptions,
    ...this.walkSpriteOptions,
  });

  attackSpriteOptions = {
    duration: 5,
    speed: 4,
  };

  attackDown = new AnimationController({
    srcImg: attackDownImgSrc,
    srcX: 28,
    srcY: 23,
    offsetX: -19,
    offsetY: -8,
    ...this.defaultSpriteOptions,
    ...this.attackSpriteOptions,
  });
  attackUp = new AnimationController({
    srcImg: attackUpImgSrc,
    srcX: 24,
    srcY: 0,
    offsetX: -24,
    offsetY: -31,
    ...this.defaultSpriteOptions,
    ...this.attackSpriteOptions,
  });
  attackLeft = new AnimationController({
    srcImg: attackLeftImgSrc,
    srcX: 7,
    srcY: 3,
    offsetX: -41,
    offsetY: -28,
    ...this.defaultSpriteOptions,
    ...this.attackSpriteOptions,
  });
  attackRight = new AnimationController({
    srcImg: attackRightImgSrc,
    srcX: 24,
    srcY: 1,
    offsetX: -24,
    offsetY: -30,
    ...this.defaultSpriteOptions,
    ...this.attackSpriteOptions,
  });
}
