import { GameObject } from '../game-objects/game-object';
import { BlobMonster } from '../game-objects/monsters/blob-monster';
import { Camera } from '../camera';
import { PalmTree } from '../game-objects/scenery/palm-tree';
import { GameObjectType } from '../game-objects/game-objects';
import { TileMaps } from '../tile-maps/tile-maps';

export interface GameObjectData {
  type: GameObjectType;
  sprite: any;
}

export class GameObjectSelector {
  private ui: HTMLDivElement;
  private selected: GameObject | undefined;
  private objects: GameObjectData[];
  private camera: Camera;
  private tileMaps: TileMaps;

  constructor(camera: Camera, tileMaps: TileMaps) {
    this.camera = camera;
    this.tileMaps = tileMaps;
    this.objects = [
      {
        type: GameObjectType.BlobMonster,
        sprite: BlobMonster.sprite,
      },
      {
        type: GameObjectType.PalmTree,
        sprite: PalmTree.sprite,
      },
    ];
    this.ui = document.getElementById('game-object-selector') as HTMLDivElement;
    this.objects.forEach((object) => {
      const swatchEl = document.createElement('img');
      swatchEl.src = object.sprite;
      swatchEl.width = 64;
      swatchEl.height = 64;
      swatchEl.setAttribute('data-type', object.type + '');
      swatchEl.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.ui.append(swatchEl);
    });
  }

  hide() {
    this.ui.style.display = 'none';
  }

  show() {
    this.ui.style.display = 'block';
  }

  getSelectedObject(): GameObject | undefined {
    return this.selected;
  }

  setSelectedObject(object: GameObject | undefined) {
    this.selected = object;
  }

  private onMouseDown(e: MouseEvent) {
    const type = (e.target as HTMLImageElement).getAttribute(
      'data-type'
    ) as string;

    // Instantiate new object
    switch (type) {
      case GameObjectType.BlobMonster:
        this.selected = new BlobMonster(
          { x: 0, y: 0 },
          this.camera,
          this.tileMaps
        );
        break;
      case GameObjectType.PalmTree:
        this.selected = new PalmTree({ x: 0, y: 0 }, this.camera);
        break;
    }
  }
}
