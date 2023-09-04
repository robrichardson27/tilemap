import { Camera } from '../../camera';
import { TileMap } from '../../tile-map';
import { Point } from '../../utils';
import blobImgSrc from '../../../assets/sprites/blob.png';
import { Monster } from './monster';

let nextId = 0;

export class BlobMonster extends Monster {
  static BlobId = 'blob-monster-';
  /**
   * Create a blob monster
   */
  constructor(pos: Point, camera: Camera, background: TileMap) {
    super({
      id: BlobMonster.BlobId + nextId++,
      hide: false,
      layer: 2,
      x: pos.x,
      y: pos.y,
      width: 56,
      height: 72,
      srcX: 4,
      srcY: 0,
      camera: camera,
      imgSrc: blobImgSrc,
      background: background,
      stats: {
        speed: 1.5,
        health: 20,
        attackPower: 0.5,
        attackSpeed: 20,
      },
    });
  }
}
