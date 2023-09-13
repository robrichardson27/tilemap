import { Camera } from '../../camera';
import { Point } from '../../utils';
import palmTreeImgSrc from '../../../assets/sprites/tree-palm.png';
import { GameObjectType } from '../game-objects';
import { AnimationController } from '../animation-controller';
import { GameObjectAnimated } from '../game-object-animated';

let nextId = 0;

export class PalmTree extends GameObjectAnimated {
  static ID = 'palm-tree-';
  static sprite = palmTreeImgSrc;

  constructor(pos: Point, camera: Camera) {
    super({
      type: GameObjectType.PalmTree,
      id: PalmTree.ID + nextId++,
      hide: false,
      layer: 4,
      x: pos.x,
      y: pos.y,
      width: 14,
      height: 1,
      camera: camera,
      animation: new AnimationController({
        duration: 0,
        srcImg: PalmTree.sprite,
        srcX: 0,
        srcY: 0,
        offsetX: -34,
        offsetY: -57,
        width: 64,
        height: 93,
        speed: 0,
      }),
    });
  }

  render(context: CanvasRenderingContext2D): void {
    this.animation.render(context, this.pos);
  }

  update(): void {
    // Not implemented
  }
}
