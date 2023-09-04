import { Camera } from './camera';
import { Canvas } from './canvas';
import { Key, Keyboard } from './keyboard';
import { TileMap } from './tile-map';
import { PlayerUi } from './player-ui';
import { Mouse } from './mouse';
import { BackgroundAudio } from './background-audio';
import { GameObjects } from './game-objects/game-objects';
import { first, fromEvent } from 'rxjs';
import { rgbArrayToString } from './utils';

/**
 * Main game class, creates game objects
 * starts game loop, updates and renders
 */
export class Game {
  static TickInterval = 100;

  canvas: Canvas;
  gameObjects: GameObjects;
  background: TileMap;
  private tick: number = 0;
  private requestId!: number;

  constructor() {
    this.canvas = new Canvas('game');
    const keyboard = new Keyboard([Key.Left, Key.Right, Key.Up, Key.Down]);
    const mouse = new Mouse(this.canvas.getCanvas());
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

    this.gameObjects = new GameObjects({
      camera: camera,
      background: this.background,
      mouse: mouse,
      keyboard: keyboard,
      canvas: this.canvas,
    });

    // Create and add game objects
    // TODO: load from file and add to game editor
    this.gameObjects
      .addPlayer({ x: 350, y: 150 })
      .addBlob({ x: 200, y: 300 })
      .addBlob({ x: 550, y: 550 })
      .addBlob({ x: 150, y: 400 })
      .addBlob({ x: 100, y: 600 })
      .addBlob({ x: 500, y: 350 })
      .addPalmTree({ x: 280, y: 210 })
      .addPalmTree({ x: 400, y: 220 })
      .addPalmTree({ x: 420, y: 420 });

    // Create and add player ui to canvas
    const playerUi = new PlayerUi(this.gameObjects.getPlayer());
    this.canvas.addLayer(playerUi);

    // Add all game objects to a canvas layer
    this.gameObjects.forEach((object) => this.canvas.addLayer(object));
  }

  start() {
    // TODO: create pixel art splash screen with controls
    const context = this.canvas.getContext();
    context.font = '24px sans-serif';
    context.fillStyle = rgbArrayToString([255, 255, 255]);
    context.fillText('Click to start', 250, 350);
    // Start game on click
    fromEvent(document, 'click')
      .pipe(first())
      .subscribe(() => {
        // Start background audio
        BackgroundAudio.start();
        // Run game
        this.run(0);
      });
  }

  stop() {
    window.cancelAnimationFrame(this.requestId);
    document.location.reload();
  }

  private run = (time: DOMHighResTimeStamp) => {
    this.tick = Math.round(time / Game.TickInterval);
    this.requestId = window.requestAnimationFrame(this.run);
    this.update();
    this.render();
  };

  private update() {
    // TODO: Improve player death
    const player = this.gameObjects.getPlayer();
    if (player.stats.health <= 0) {
      this.stop();
    }
    // Update all objects
    this.gameObjects.forEach((object, options) =>
      object.update({
        gameObjects: this.gameObjects,
        keyboard: options.keyboard,
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
