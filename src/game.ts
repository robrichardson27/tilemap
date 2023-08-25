import { Camera } from './camera';
import { Canvas } from './canvas';
import { Player } from './game-objects/player';
import { Key, Keyboard } from './keyboard';
import { TileMap } from './tile-map';
import { GameObject, GameObjects } from './game-objects/game-object';
import { BlobMonster } from './game-objects/blob-monster';
import { DEBUG } from './app';
import { PlayerUi } from './player-ui';

/**
 * Main game class, creates game objects
 * starts game loop, updates and renders
 */
export class Game {
  static TickInterval = 100;

  canvas: Canvas;
  background: TileMap;
  keyboard: Keyboard;
  gameObjects: GameObjects = new Map<string, GameObject>();
  tick: number = 0;

  constructor() {
    this.canvas = new Canvas('game');
    this.keyboard = new Keyboard([Key.Left, Key.Right, Key.Up, Key.Down]);
    this.background = TileMap.createBackground(10, 10);
    const camera = new Camera(
      0,
      0,
      Canvas.Width,
      Canvas.Height,
      this.background
    );
    this.background.setCamera(camera);
    this.canvas.addLayer(this.background);

    // Create and add player to game objects
    const player = new Player(
      { x: 5 * TileMap.TSize, y: 5 * TileMap.TSize },
      camera,
      this.background
    );
    this.gameObjects.set(player.id, player);

    // Create and add player ui to canvas
    const playerUi = new PlayerUi(player);
    this.canvas.addLayer(playerUi);

    // Create and add monsters to game objects
    for (let i = 0; i < 3; i++) {
      const p = this.gameObjects.get(Player.PlayerId) as Player;
      const x = p.x - 2 * TileMap.TSize + i * TileMap.TSize;
      const y = p.y + TileMap.TSize * 3;
      const blob = new BlobMonster({ x: x, y: y }, camera, this.background);
      this.gameObjects.set(blob.id, blob);
    }

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
    Array.from(this.gameObjects.values()).forEach((object) =>
      object.update({
        gameObjects: this.gameObjects,
        keyboard: this.keyboard,
        tick: this.tick,
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
