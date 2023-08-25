import { Camera } from '../camera';
import { TileMap } from '../tile-map';
import { Point } from '../utils';
import blobImgSrc from '../../assets/blob.png';
import { Monster } from './monster';

let nextId = 0;

export class BlobMonster extends Monster {
  static BlobId = 'blob-monster-';
  /**
   * Create a blob monster
   */
  constructor(start: Point, camera: Camera, background: TileMap) {
    super({
      id: BlobMonster.BlobId + nextId++,
      hide: false,
      layer: 2,
      x: start.x,
      y: start.y,
      width: 28,
      height: 36,
      srcX: 18,
      srcY: 9,
      camera: camera,
      imgSrc: blobImgSrc,
      background: background,
      stats: {
        speed: 1,
        health: 5,
        attackPower: 0.5,
        attackSpeed: 20,
      },
    });
  }
}
