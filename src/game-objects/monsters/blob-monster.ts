import { Camera } from '../../camera';
import { Point } from '../../utils';
import blobImgSrc from '../../../assets/sprites/blob.png';
import { Monster } from './monster';
import { GameObjectType } from '../game-objects';
import { TileMaps } from '../../tile-maps/tile-maps';

let nextId = 0;

export class BlobMonster extends Monster {
  static BlobId = 'blob-monster-';
  static sprite = blobImgSrc;
  /**
   * Create a blob monster
   */
  constructor(pos: Point, camera: Camera, tileMaps: TileMaps) {
    super({
      id: BlobMonster.BlobId + nextId++,
      type: GameObjectType.BlobMonster,
      hide: false,
      layer: 2,
      x: pos.x,
      y: pos.y,
      width: 64,
      height: 76,
      srcX: 2,
      srcY: 0,
      camera: camera,
      imgSrc: BlobMonster.sprite,
      tileMaps: tileMaps,
      stats: {
        speed: 1.5,
        health: 20,
        attackPower: 0.5,
        attackSpeed: 20,
      },
    });
  }
}
