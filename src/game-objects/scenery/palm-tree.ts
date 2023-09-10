import { Camera } from '../../camera';
import { Point } from '../../utils';
import { SceneryObject } from './scenery-object';
import palmTreeImgSrc from '../../../assets/sprites/tree-palm.png';
import { GameObjectType } from '../game-objects';

let nextId = 0;

export class PalmTree extends SceneryObject {
  static palmTreeId = 'palm-tree-';
  static sprite = palmTreeImgSrc;

  constructor(pos: Point, camera: Camera) {
    super({
      type: GameObjectType.PalmTree,
      id: PalmTree.palmTreeId + nextId++,
      hide: false,
      layer: 1,
      x: pos.x + 29,
      y: pos.y + 42,
      width: 24,
      height: 50,
      srcX: 0,
      srcY: 0,
      camera: camera,
      imgSrc: PalmTree.sprite,
      renderX: pos.x,
      renderY: pos.y,
      renderWidth: 64,
      renderHeight: 93,
    });
  }
}
