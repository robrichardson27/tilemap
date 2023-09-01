import { Camera } from '../camera';
import { TileMap } from '../tile-map';
import { Point } from '../utils';
import { GameObject } from './game-object';
import { BlobMonster } from './monsters/blob-monster';

export class GameObjects {
  private objects = new Map<string, GameObject>();

  get(id: string) {
    return this.objects.get(id);
  }

  set(id: string, object: GameObject): GameObjects {
    this.objects.set(id, object);
    return this;
  }

  delete(id: string): GameObjects {
    this.objects.delete(id);
    return this;
  }

  forEach(
    callbackfn: (
      value: GameObject,
      key: string,
      map: Map<string, GameObject>
    ) => void
  ) {
    this.objects.forEach((object, key, objects) => {
      callbackfn(object, key, objects);
    });
  }

  addBlob(pos: Point, camera: Camera, background: TileMap) {
    const blob = new BlobMonster(pos, camera, background);
    this.set(blob.id, blob);
    return this;
  }
}
