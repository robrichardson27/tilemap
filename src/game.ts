import { Camera } from './camera';
import { Canvas } from './canvas';
import { Character } from './character';
import { Key, Keyboard } from './keyboard';
import { TileMap } from './tile-map';
import tileImgSrc from '../assets/tiles.png';

/**
 * Main game class, inits game objects, loads tiles,
 * starts game loop, updates and renders
 */
export class Game {
  static TickInterval = 200;

  static run(): Game {
    const game = new Game();
    game.canvas = new Canvas('game');
    game.debugCanvas = new Canvas('debug');
    game.context = game.canvas.getContext();
    game.debugContext = game.debugCanvas.getContext();
    game.camera = new Camera(0, 0, Canvas.Width, Canvas.Height);
    game.keyboard = new Keyboard([Key.Left, Key.Right, Key.Up, Key.Down]);
    game.tileMaps = [
      TileMap.generateBackground(),
      TileMap.generateForeground(),
    ];
    game.character = new Character(0, 0, game);
    game.load();
    game.start(0);
    return game;
  }

  canvas!: Canvas;
  debugCanvas!: Canvas;
  context!: CanvasRenderingContext2D;
  debugContext!: CanvasRenderingContext2D;
  camera!: Camera;
  keyboard!: Keyboard;
  tileMaps: TileMap[] = [];
  character!: Character;
  tick: number = 0;

  tileImg!: HTMLImageElement;

  load() {
    this.character.load();
    this.tileImg = new Image();
    this.tileImg.src = tileImgSrc;
  }

  start = (time: DOMHighResTimeStamp) => {
    this.tick = Math.round(time / Game.TickInterval);
    window.requestAnimationFrame(this.start);
    this.update();
    this.render();
  };

  update() {
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
    // Move monster
    // this.monster.update();
  }

  render() {
    // Clear previous frame
    this.context.clearRect(0, 0, Canvas.Width, Canvas.Height);
    this.debugContext.clearRect(0, 0, Canvas.Width, Canvas.Height);
    // Render background
    this.tileMaps[0].render(this.context, this.tileImg, this.camera);
    // Render character
    this.character.render();
    // Render foreground
    this.tileMaps[1].render(this.context, this.tileImg, this.camera);
  }
}
