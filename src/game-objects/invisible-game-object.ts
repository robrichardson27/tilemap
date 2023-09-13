import { Camera } from '../camera';
import { Point } from '../utils';
import { GameObject } from './game-object';
import { GameObjectType } from './game-objects';
import invisibleImgSrc from '../../assets/sprites/invisible-object.png';

let nextId = 0;

export class InvisibleGameObject extends GameObject {
  static ID = 'invisible-';
  static sprite = invisibleImgSrc;

  constructor(pos: Point, width: number, height: number, camera: Camera) {
    super({
      type: GameObjectType.InvisibleGameObject,
      id: InvisibleGameObject.ID + nextId++,
      hide: false,
      layer: 4,
      x: pos.x,
      y: pos.y,
      width: width,
      height: height,
      camera: camera,
    });
  }

  render(): void {
    // Not implemented
  }

  update(): void {
    // Not implemented
  }
}
