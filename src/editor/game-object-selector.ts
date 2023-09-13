import { BlobMonster } from '../game-objects/monsters/blob-monster';
import { PalmTree } from '../game-objects/scenery/palm-tree';
import { GameObjectType, GameObjects } from '../game-objects/game-objects';
import { GameObject, GameObjectOptions } from '../game-objects/game-object';
import { InvisibleGameObject } from '../game-objects/invisible-game-object';

export interface GameObjectData {
  type: GameObjectType;
  sprite?: any;
}

export class GameObjectSelector {
  private ui: HTMLDivElement;
  private selectedObject: GameObject | undefined;
  private selectedType: GameObjectType | undefined;
  private objects: GameObjectData[];
  private gameObjects: GameObjects;

  private selectedObjectOptions: GameObjectOptions = <GameObjectOptions>{};

  constructor(gameObjects: GameObjects) {
    this.gameObjects = gameObjects;
    this.objects = [
      {
        type: GameObjectType.BlobMonster,
        sprite: BlobMonster.sprite,
      },
      {
        type: GameObjectType.PalmTree,
        sprite: PalmTree.sprite,
      },
      {
        type: GameObjectType.InvisibleGameObject,
        sprite: InvisibleGameObject.sprite,
      },
    ];
    this.ui = document.getElementById('game-object-selector') as HTMLDivElement;
    this.objects.forEach((object) => {
      const swatchEl = document.createElement('img');
      swatchEl.src = object.sprite;
      swatchEl.width = 64;
      swatchEl.height = 64;
      const styles = `margin-right: 4px; border: solid 2px rgba(0,0,0,0); cursor: pointer; object-fit: contain;`;
      swatchEl.style.cssText = styles;
      swatchEl.setAttribute('data-type', object.type + '');
      swatchEl.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.ui.append(swatchEl);
    });

    const widthEl = document.getElementById(
      'game-object-width-input'
    ) as HTMLInputElement;
    const heightEl = document.getElementById(
      'game-object-height-input'
    ) as HTMLInputElement;

    widthEl.addEventListener('input', (e) => {
      const width = parseInt((e.target as HTMLInputElement).value);
      this.selectedObjectOptions.width = width;
      if (this.selectedObject) {
        this.selectedObject.width = width;
      }
    });
    heightEl.addEventListener('input', (e) => {
      const height = parseInt((e.target as HTMLInputElement).value);
      this.selectedObjectOptions.height = height;
      if (this.selectedObject) {
        this.selectedObject.height = height;
      }
    });
  }

  hide() {
    this.ui.style.display = 'none';
  }

  show() {
    this.ui.style.display = 'block';
  }

  getSelectedObject(): GameObject | undefined {
    return this.selectedObject;
  }

  setSelectedObject(object: GameObject | undefined) {
    this.selectedObject = object;
    this.selectedType = undefined;
    if (object === undefined) {
      this.clearSelectedStyle();
    }
  }

  private onMouseDown(e: MouseEvent) {
    this.clearSelectedStyle();
    const type = (e.target as HTMLImageElement).getAttribute(
      'data-type'
    ) as GameObjectType;
    (e.target as HTMLImageElement).style.border = '2px solid red';

    if (type === this.selectedType) {
      this.selectedType = undefined;
      this.selectedObject = undefined;
      this.clearSelectedStyle();
    } else {
      this.selectedType = type;
      this.selectedObject = this.gameObjects.createObject({
        type: type,
        pos: { x: -100, y: -100 },
        width: this.selectedObjectOptions.width
          ? this.selectedObjectOptions.width
          : 0,
        height: this.selectedObjectOptions.height
          ? this.selectedObjectOptions.height
          : 0,
      });
    }
  }

  private clearSelectedStyle(): void {
    this.ui.childNodes.forEach((tile) => {
      if (tile instanceof HTMLImageElement) {
        (tile as HTMLImageElement).style.border = '2px solid rgba(0,0,0,0)';
      }
    });
  }
}
