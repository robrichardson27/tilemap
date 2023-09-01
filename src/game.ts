import { Camera } from './camera';
import { Canvas } from './canvas';
import { Player } from './game-objects/player/player';
import { Key, Keyboard } from './keyboard';
import { TileMap } from './tile-map';
import { DEBUG } from './app';
import { PlayerUi } from './player-ui';
import { Mouse } from './mouse';
import { BackgroundAudio } from './background-audio';
import { GameObjects } from './game-objects/game-objects';

/**
 * Main game class, creates game objects
 * starts game loop, updates and renders
 */
export class Game {
  static TickInterval = 100;

  canvas: Canvas;
  background: TileMap;
  keyboard: Keyboard;
  mouse: Mouse;
  gameObjects: GameObjects = new GameObjects();
  tick: number = 0;

  constructor() {
    this.canvas = new Canvas('game');
    this.keyboard = new Keyboard([Key.Left, Key.Right, Key.Up, Key.Down]);
    this.mouse = new Mouse(this.canvas.getCanvas());
    // TODO: create levels and load in when reaching edge of current
    this.background = TileMap.createBackground(20, 20);
    const camera = new Camera(
      0,
      0,
      Canvas.Width,
      Canvas.Height,
      this.background
    );
    this.background.setCamera(camera);
    this.canvas.addLayer(this.background);
    // Start ambience audio
    BackgroundAudio.start();

    // Create and add player to game objects
    const player = new Player({
      start: { x: 5 * TileMap.TSize, y: 5 * TileMap.TSize },
      camera: camera,
      background: this.background,
      mouse: this.mouse,
    });
    this.gameObjects.set(player.id, player);

    // Create and add player ui to canvas
    const playerUi = new PlayerUi(player);
    this.canvas.addLayer(playerUi);

    // Create and add monsters to game objects
    // TODO: load from file and add to game editor
    this.gameObjects
      .addBlob({ x: 200, y: 300 }, camera, this.background)
      .addBlob({ x: 550, y: 550 }, camera, this.background)
      .addBlob({ x: 150, y: 400 }, camera, this.background)
      .addBlob({ x: 100, y: 600 }, camera, this.background)
      .addBlob({ x: 500, y: 350 }, camera, this.background);

    // Add all game objects to a canvas layer
    this.gameObjects.forEach((object) => this.canvas.addLayer(object));
  }

  run() {
    this.start(0);
    if (DEBUG.enabled) {
      console.log(this);
    }
  }

  private start = (time: DOMHighResTimeStamp) => {
    this.tick = Math.round(time / Game.TickInterval);
    window.requestAnimationFrame(this.start);
    this.update();
    this.render();
  };

  private update() {
    // Update all objects
    this.gameObjects.forEach((object) =>
      object.update({
        gameObjects: this.gameObjects,
        keyboard: this.keyboard,
        tick: this.tick,
        canvas: this.canvas,
      })
    );
  }

  private render() {
    // Clear previous frame
    this.canvas.clear();
    // Rener all canvas layers
    this.canvas.render(this.tick);
  }
}
