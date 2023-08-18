import { Camera } from './camera';
import { Canvas } from './canvas';
import { Player } from './game-objects/player';
import { Monster } from './game-objects/monster';
import { Key, Keyboard } from './keyboard';
import { TileMap } from './tile-map';
import { getRandomInt } from './utils';
import { GameObject } from './game-objects/game-object';

/**
 * Main game class, creates game objects
 * starts game loop, updates and renders
 */
export class Game {
  static TickInterval = 100;

  canvas: Canvas;
  camera: Camera;
  keyboard: Keyboard;
  background: TileMap;
  tick: number = 0;

  gameObjects: Map<string, GameObject> = new Map<string, GameObject>();

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
    this.canvas.addLayer(this.background);

    this.gameObjects.set(
      Player.PlayerId,
      Player.createPlayer(
        { x: 5 * TileMap.TSize, y: 5 * TileMap.TSize },
        this.camera,
        this.background
      )
    );

    for (let i = 0; i < 10; i++) {
      const id = Monster.BlobId + i;
      const blob = Monster.createBlob(
        id,
        { x: getRandomInt(Canvas.Width), y: getRandomInt(Canvas.Height) },
        this.camera,
        this.background
      );
      this.gameObjects.set(id, blob);
    }

    // Add all game objects to a canvas layer
    this.gameObjects.forEach((object) => this.canvas.addLayer(object));
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
    // Move player
    const player = this.gameObjects.get(Player.PlayerId) as Player;
    player.update({ dirX: dirX, dirY: dirY });
    // Move monsters
    for (let i = 0; i < 10; i++) {
      const monster = this.gameObjects.get(Monster.BlobId + i) as Monster;
      monster.update({ gameObjects: this.gameObjects });
    }
  }

  private render() {
    // Clear previous frame
    this.canvas.clear();
    // Rener all canvas layers
    this.canvas.render(this.tick);
  }
}
