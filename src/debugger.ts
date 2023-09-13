import { CanvasLayer } from './canvas';
import { GameObjectExporter } from './editor/game-object-exporter';
import { GameObjectPlacer } from './editor/game-object-placer';
import { GameObjectSelector } from './editor/game-object-selector';
import { TileMapExporter } from './editor/tile-map-exporter';
import { TilePlacer } from './editor/tile-placer';
import { TileSelector } from './editor/tile-selector';
import { Game } from './game';

export class Debugger {
  enabled: boolean;

  private tileSelector: TileSelector;
  private tileMapExporter: TileMapExporter;
  private debugLayers: CanvasLayer[] = [];
  private game: Game;
  private gameObjectSelector: GameObjectSelector;
  private gameObjectPlacer: GameObjectPlacer;

  constructor(game: Game, enabled = false) {
    this.enabled = enabled;
    this.game = game;
    this.tileSelector = new TileSelector();
    this.gameObjectSelector = new GameObjectSelector(game.gameObjects);
    this.gameObjectPlacer = new GameObjectPlacer({
      gameObjects: game.gameObjects,
      gameObjectSelector: this.gameObjectSelector,
      camera: game.camera,
      canvas: game.canvas,
    });
    this.gameObjectPlacer;
    this.debugLayers.push(
      new TilePlacer({
        id: 'tile-placer',
        hide: !this.enabled,
        layer: 0,
        tileSelector: this.tileSelector,
        game: game,
      })
    );

    this.tileMapExporter = new TileMapExporter(this.game.tileMaps);
    GameObjectExporter.init(this.game.gameObjects);

    const checkboxEl = document.getElementById(
      'debug-input'
    ) as HTMLInputElement;
    checkboxEl.addEventListener('change', (e) => this.onChange(e));

    if (this.enabled) {
      checkboxEl.setAttribute('checked', this.enabled + '');
    } else {
      this.tileSelector.hide();
      this.tileMapExporter.hide();
      this.gameObjectSelector.hide();
    }

    this.debugLayers.forEach((layer) => this.game.canvas.addLayer(layer));
  }

  private onChange(e: Event) {
    this.enabled = (<HTMLInputElement>e.target).checked;
    if (this.enabled) {
      this.tileSelector.show();
      this.tileMapExporter.show();
      this.gameObjectSelector.show();
      this.debugLayers.forEach((layer) => (layer.hide = false));
    } else {
      this.tileSelector.hide();
      this.tileMapExporter.hide();
      this.gameObjectSelector.hide();
      this.debugLayers.forEach((layer) => (layer.hide = true));
    }
  }
}
