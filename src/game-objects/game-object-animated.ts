import { AnimationController } from './animation-controller';
import { GameObject, GameObjectOptions } from './game-object';

export interface GameObjectAnimatedOptions extends GameObjectOptions {
  /**
   * Render a single sprite animation
   */
  animation: AnimationController;
}

export abstract class GameObjectAnimated extends GameObject {
  animation: AnimationController;

  constructor(options: GameObjectAnimatedOptions) {
    super(options);
    this.animation = options.animation;
  }
}
