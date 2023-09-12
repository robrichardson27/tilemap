import { Camera } from './camera';
import { Canvas } from './canvas';
import { Key, Keyboard } from './keyboard';
import { PlayerUi } from './player-ui';
import { Mouse } from './mouse';
import { BackgroundAudio } from './background-audio';
import { GameObjects } from './game-objects/game-objects';
import { first, fromEvent } from 'rxjs';
import { rgbArrayToString } from './utils';
import tileMapBackgroundJson from '../assets/data/tile-map-background.json';
import { TileMaps } from './tile-maps/tile-maps';

/**
 * Main game class, creates game objects
 * starts game loop, updates and renders
 */
export class Game {
  static TickInterval = 100;

  canvas: Canvas;
  gameObjects: GameObjects;
  tileMaps: TileMaps;
  camera: Camera;
  private tick: number = 0;
  private requestId!: number;

  constructor() {
    this.canvas = new Canvas('game');
    const keyboard = new Keyboard([Key.Left, Key.Right, Key.Up, Key.Down]);
    const mouse = new Mouse(this.canvas.getCanvas());
    this.camera = new Camera(0, 0, Canvas.Width, Canvas.Height, 20, 20);

    // TODO: create levels and load in when reaching edge of current
    this.tileMaps = new TileMaps({ camera: this.camera, canvas: this.canvas });
    this.tileMaps.createBackgrounds(20, 20, tileMapBackgroundJson);

    this.gameObjects = new GameObjects({
      camera: this.camera,
      tileMaps: this.tileMaps,
      mouse: mouse,
      keyboard: keyboard,
      canvas: this.canvas,
    });

    // Create and add game objects from file
    this.gameObjects.load();

    // Create and add player ui to canvas
    const playerUi = new PlayerUi(this.gameObjects.getPlayer());
    this.canvas.addLayer(playerUi);
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
