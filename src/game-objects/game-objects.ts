import { Camera } from '../camera';
import { Canvas } from '../canvas';
import { Keyboard } from '../keyboard';
import { Mouse } from '../mouse';
import { TileMap } from '../tile-map';
import { Point } from '../utils';
import { GameObject } from './game-object';
import { BlobMonster } from './monsters/blob-monster';
import { Player } from './player/player';
import { PalmTree } from './scenery/palm-tree';

export interface GameObjectsOptions {
  camera: Camera;
  background: TileMap;
  mouse: Mouse;
  keyboard: Keyboard;
  canvas: Canvas;
}

export class GameObjects {
  private options: GameObjectsOptions;

  constructor(options: GameObjectsOptions) {
    this.options = options;
  }

  private objects = new Map<string, GameObject>();

  get(id: string): GameObject {
    if (this.objects.has(id)) {
      return this.objects.get(id) as GameObject;
    }
    throw Error('Object not foud');
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
      options: GameObjectsOptions,
      key: string,
      map: Map<string, GameObject>
    ) => void
  ) {
    this.objects.forEach((object, key, objects) => {
      callbackfn(object, this.options, key, objects);
    });
  }

  addPlayer(pos: Point): GameObjects {
    const player = new Player({
      pos: pos,
      camera: this.options.camera,
      background: this.options.background,
      mouse: this.options.mouse,
    });
    this.set(player.id, player);
    return this;
  }

  getPlayer(): Player {
    return this.get(Player.PlayerId) as Player;
  }

  addBlob(pos: Point): GameObjects {
    const blob = new BlobMonster(
      pos,
      this.options.camera,
      this.options.background
    );
    this.set(blob.id, blob);
    return this;
  }

  addPalmTree(pos: Point): GameObjects {
    const tree = new PalmTree(pos, this.options.camera);
    this.set(tree.id, tree);
    return this;
  }
}
