import { Camera } from '../camera';
import { Canvas } from '../canvas';
import { Keyboard } from '../keyboard';
import { Mouse } from '../mouse';
import { TileMaps } from '../tile-maps/tile-maps';
import { Point } from '../utils';
import { GameObject } from './game-object';
import { BlobMonster } from './monsters/blob-monster';
import { Player } from './player/player';
import { PalmTree } from './scenery/palm-tree';
import gameObjectsJson from '../../assets/data/game-objects.json';

export enum GameObjectType {
  Player = 'Player',
  BlobMonster = 'BlobMonster',
  PalmTree = 'PalmTree',
}

export interface GameObjectsOptions {
  camera: Camera;
  tileMaps: TileMaps;
  mouse: Mouse;
  keyboard: Keyboard;
  canvas: Canvas;
}

export interface GameObjectData {
  pos: Point;
  type: GameObjectType;
}

export class GameObjects {
  private options: GameObjectsOptions;

  constructor(options: GameObjectsOptions) {
    this.options = options;
  }

  private objects = new Map<string, GameObject>();

  has(id: string): boolean {
    return this.objects.has(id);
  }

  get(id: string): GameObject {
    if (this.objects.has(id)) {
      return this.objects.get(id) as GameObject;
    }
    throw Error('Object not foud');
  }

  set(id: string, object: GameObject): GameObjects {
    this.objects.set(id, object);
    this.options.canvas.addLayer(object);
    return this;
  }

  delete(id: string): GameObjects {
    this.objects.delete(id);
    this.options.canvas.removeLayer(id);
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

  toArray(): GameObject[] {
    return Array.from(this.objects.values());
  }

  toJsonString(): string {
    return JSON.stringify(this.toArray().map((object) => object.export()));
  }

  load() {
    const objects = gameObjectsJson as GameObjectData[];
    objects.forEach((object) => this.createObject(object));
  }

  createObject(object: GameObjectData) {
    switch (object.type) {
      case GameObjectType.Player:
        this.addPlayer(object.pos);
        break;
      case GameObjectType.BlobMonster:
        this.addBlob(object.pos);
        break;
      case GameObjectType.PalmTree:
        this.addPalmTree(object.pos);
    }
  }

  addPlayer(pos: Point): GameObjects {
    const player = new Player({
      pos: pos,
      camera: this.options.camera,
      tileMaps: this.options.tileMaps,
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
      this.options.tileMaps
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
