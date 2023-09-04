import { CanvasLayer } from './canvas';
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

  constructor(game: Game, enabled = false) {
    this.enabled = enabled;
    this.game = game;
    this.tileSelector = new TileSelector();
    this.debugLayers.push(
      new TilePlacer({
        id: 'tile-placer',
        hide: !this.enabled,
        layer: 0,
        tileSelector: this.tileSelector,
        canvas: this.game.canvas,
        tileMap: this.game.background,
      })
    );

    this.tileMapExporter = new TileMapExporter(this.game.background);

    const checkboxEl = document.getElementById(
      'debug-input'
    ) as HTMLInputElement;
    checkboxEl.addEventListener('change', (e) => this.onChange(e));

    if (this.enabled) {
      checkboxEl.setAttribute('checked', this.enabled + '');
    } else {
      this.tileSelector.hide();
      this.tileMapExporter.hide();
    }

    this.debugLayers.forEach((layer) => this.game.canvas.addLayer(layer));
  }

  private onChange(e: Event) {
    this.enabled = (<HTMLInputElement>e.target).checked;
    if (this.enabled) {
      this.tileSelector.show();
      this.tileMapExporter.show();
    } else {
      this.tileSelector.hide();
      this.tileMapExporter.hide();
    }
  }
}
