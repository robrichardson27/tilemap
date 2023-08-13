import { Camera } from './camera';
import { Canvas } from './canvas';
import { Character } from './character';
import { Key, Keyboard } from './keyboard';
import { TileMap } from './tile-map';
import { TileSelector } from './editor/tile-selector';
import { DEBUG } from './app';
import { TilePlacer } from './editor/tile-placer';

/**
 * Main game class, inits game objects, loads tiles,
 * starts game loop, updates and renders
 */
export class Game {
  static TickInterval = 200;

  static run(): Game {
    const game = new Game();
    game.canvas = new Canvas('game');
    game.keyboard = new Keyboard([Key.Left, Key.Right, Key.Up, Key.Down]);

    game.background = TileMap.createBackground();

    game.camera = new Camera(
      0,
      0,
      Canvas.Width,
      Canvas.Height,
      game.background
    );

    game.background.setCamera(game.camera);

    // TODO: tidy up game editor and debug stuff
    game.tileSelector = new TileSelector();
    game.tilePlacer = new TilePlacer({
      id: 'tile-placer',
      hide: !DEBUG.enabled,
      tileSelector: game.tileSelector,
      canvas: game.canvas,
      tileMap: game.background,
    });

    game.character = new Character({
      id: 'character',
      hide: false,
      x: 0,
      y: 0,
      camera: game.camera,
      tileMap: game.background,
      tick: game.tick,
      keyboard: game.keyboard,
    });

    game.canvas
      .addLayer(game.background)
      .addLayer(game.tilePlacer)
      .addLayer(game.character);

    game.start(0);
    return game;
  }

  canvas!: Canvas;
  tileSelector!: TileSelector;
  tilePlacer!: TilePlacer;
  camera!: Camera;
  keyboard!: Keyboard;
  background!: TileMap;
  character!: Character;
  tick: number = 0;

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
  }

  render() {
    // Clear previous frame
    this.canvas.clear();
    // Rener all canvas layers
    this.canvas.render();

    // TODO: Tidy up level editor stuff
    this.tileSelector.clear();
    if (DEBUG.enabled) {
      this.tileSelector.render();
    }
  }
}
