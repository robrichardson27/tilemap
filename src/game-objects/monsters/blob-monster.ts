import { Camera } from '../../camera';
import { Point } from '../../utils';
import blobImgSrc from '../../../assets/sprites/blob.png';
import { Monster } from './monster';
import { GameObjectType } from '../game-objects';
import { TileMaps } from '../../tile-maps/tile-maps';
import { AnimationController } from '../animation-controller';

let nextId = 0;

export class BlobMonster extends Monster {
  static ID = 'blob-monster-';
  static sprite = blobImgSrc;
  /**
   * Create a blob monster
   */
  constructor(pos: Point, camera: Camera, tileMaps: TileMaps) {
    super({
      id: BlobMonster.ID + nextId++,
      type: GameObjectType.BlobMonster,
      hide: false,
      layer: 3,
      x: pos.x,
      y: pos.y,
      width: 64,
      height: 76,
      camera: camera,
      tileMaps: tileMaps,
      stats: {
        speed: 1.5,
        health: 20,
        attackPower: 0.5,
        attackSpeed: 20,
      },
      animation: new AnimationController({
        duration: 4,
        srcImg: BlobMonster.sprite,
        srcX: 2,
        srcY: 0,
        offsetX: 0,
        offsetY: 0,
        width: 64,
        height: 76,
        speed: 10,
      }),
    });
  }
}
