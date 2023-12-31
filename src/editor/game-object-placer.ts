import { DEBUG } from '../app';
import { Camera } from '../camera';
import { Canvas } from '../canvas';
import { GameObject } from '../game-objects/game-object';
import { GameObjects } from '../game-objects/game-objects';
import { GameObjectSelector } from './game-object-selector';

export interface GameObjectPlacerOptions {
  gameObjectSelector: GameObjectSelector;
  canvas: Canvas;
  camera: Camera;
  gameObjects: GameObjects;
}

export class GameObjectPlacer {
  private gameObjectSelector: GameObjectSelector;
  private gameObjects: GameObjects;
  private gameCanvas: HTMLCanvasElement;
  private camera: Camera;

  constructor(options: GameObjectPlacerOptions) {
    this.gameObjectSelector = options.gameObjectSelector;
    this.gameCanvas = options.canvas.getCanvas();
    this.camera = options.camera;
    this.gameObjects = options.gameObjects;
    this.gameCanvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.gameCanvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.gameCanvas.addEventListener(
      'mouseleave',
      this.onMouseLeave.bind(this)
    );
  }

  get selectedObject(): GameObject | undefined {
    return this.gameObjectSelector.getSelectedObject();
  }

  set selectedObject(object: GameObject | undefined) {
    this.gameObjectSelector.setSelectedObject(object);
  }

  onMouseDown(e: MouseEvent) {
    if (DEBUG.enabled && e.button === 0 && this.selectedObject) {
      const rect = this.gameCanvas.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left) + this.camera.x;
      const y = Math.round(e.clientY - rect.top) + this.camera.y;
      this.selectedObject.x = x;
      this.selectedObject.y = y;
      this.selectedObject = undefined;
    }
  }

  onMouseMove(e: MouseEvent) {
    if (DEBUG.enabled && this.selectedObject) {
      const rect = this.gameCanvas.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left) + this.camera.x;
      const y = Math.round(e.clientY - rect.top) + this.camera.y;

      if (this.gameObjects.has(this.selectedObject.id)) {
        const selected = this.gameObjects.get(this.selectedObject.id);
        selected.x = x;
        selected.y = y;
      } else {
        this.selectedObject.x = x;
        this.selectedObject.y = y;
        this.gameObjects.set(this.selectedObject.id, this.selectedObject);
      }

      const el = document.getElementById('game-object-pos') as HTMLSpanElement;
      el.innerText = `{ x: ${this.selectedObject.x}, y: ${this.selectedObject.y} }`;
    }
  }

  onMouseLeave() {
    if (this.selectedObject) {
      this.gameObjects.delete(this.selectedObject.id);
      const el = document.getElementById('game-object-pos') as HTMLSpanElement;
      el.innerText = '';
    }
  }
}
