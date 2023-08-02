import { Camera } from './camera';
import { Canvas } from './canvas';
import { Character } from './character';
import { Key, Keyboard } from './keyboard';
import { TileMap } from './tile-map';
import tileImgSrc from '../assets/tiles.png';
import charImgSrc from '../assets/character.png';

/**
 * Main game class, inits game objects, loads tiles,
 * starts game loop, updates and renders
 */
export class Game {
  static Debug = true;

  static run() {
    const game = new Game();
    game.canvas = new Canvas();
    game.context = game.canvas.getContext();
    game.camera = new Camera(0, 0, Canvas.Width, Canvas.Height);
    game.keyboard = new Keyboard([Key.Left, Key.Right, Key.Up, Key.Down]);
    game.tileMaps = [
      TileMap.generateBackground(),
      TileMap.generateForeground(),
    ];
    game.character = new Character(0, 0, game.context);
    game.load();
    game.start();
    return game;
  }

  canvas!: Canvas;
  context!: CanvasRenderingContext2D;
  camera!: Camera;
  keyboard!: Keyboard;
  tileMaps: TileMap[] = [];
  character!: Character;

  tileImg!: HTMLImageElement;
  characterImg!: HTMLImageElement;

  debug = false;

  load() {
    this.tileImg = new Image();
    this.tileImg.src = tileImgSrc;
    this.characterImg = new Image();
    this.characterImg.src = charImgSrc;
  }

  start = () => {
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
    // Check character can move
    if (this.character.canMove(dirX, dirY, this.tileMaps[1], this.camera)) {
      // Move camera
      this.camera.move(dirX, dirY);
      // Move character
      this.character.move(dirX, dirY, this.camera);
    }
  }

  render() {
    // Clear previous frame
    this.context.clearRect(0, 0, Canvas.Width, Canvas.Height);
    // Render background
    this.tileMaps[0].renderMap(this.context, this.tileImg, this.camera);
    // Render character
    this.character.render(this.characterImg);
    // Render foreground
    this.tileMaps[1].renderMap(this.context, this.tileImg, this.camera);
  }

  // TODO make a dugug class to render all debug stuff in separate canvas
}
