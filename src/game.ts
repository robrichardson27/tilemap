import { Camera } from './camera';
import { Canvas } from './canvas';
import { Character } from './character';
import { Key, Keyboard } from './keyboard';
import { TileMap } from './tile-map';

/**
 * Main game class, creates game objects
 * starts game loop, updates and renders
 */
export class Game {
  static TickInterval = 200;

  canvas: Canvas;
  camera: Camera;
  keyboard: Keyboard;
  background: TileMap;
  character: Character;
  tick: number = 0;

  constructor() {
    this.canvas = new Canvas('game');
    this.keyboard = new Keyboard([Key.Left, Key.Right, Key.Up, Key.Down]);
    this.background = TileMap.createBackground(10, 10);
    this.camera = new Camera(
      0,
      0,
      Canvas.Width,
      Canvas.Height,
      this.background
    );
    this.background.setCamera(this.camera);

    this.character = new Character({
      id: 'character',
      hide: false,
      x: 5 * TileMap.TSize,
      y: 5 * TileMap.TSize,
      camera: this.camera,
      tileMap: this.background,
      keyboard: this.keyboard,
    });

    this.canvas.addLayer(this.background).addLayer(this.character);
  }

  run() {
    this.start(0);
  }

  private start = (time: DOMHighResTimeStamp) => {
    this.tick = Math.round(time / Game.TickInterval);
    window.requestAnimationFrame(this.start);
    this.update();
    this.render();
  };

  private update() {
    // Update direction based on keys selected
    let dirX = 0;
    let dirY = 0;
    if (this.keyboard.isDown(Key.Left)) {
      dirX = -1;
    }
    if (this.keyboard.isDown(Key.Right)) {
      dirX = 1;
    }
    if (this.keyboard.isDown(Key.Up)) {
      dirY = -1;
    }
    if (this.keyboard.isDown(Key.Down)) {
      dirY = 1;
    }
    // Move character
    this.character.update(dirX, dirY);
  }

  private render() {
    // Clear previous frame
    this.canvas.clear();
    // Rener all canvas layers
    this.canvas.render(this.tick);
  }
}
