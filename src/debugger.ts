import { CanvasLayer } from './canvas';
import { TilePlacer } from './editor/tile-placer';
import { TileSelector } from './editor/tile-selector';
import { Game } from './game';

export class Debugger {
  enabled = true;

  private tileSelector: TileSelector;
  private debugLayers: CanvasLayer[] = [];
  private game: Game;

  constructor(game: Game) {
    this.game = game;
    this.tileSelector = new TileSelector();
    this.debugLayers.push(
      new TilePlacer({
        id: 'tile-placer',
        hide: !this.enabled,
        tileSelector: this.tileSelector,
        canvas: this.game.canvas,
        tileMap: this.game.background,
      })
    );

    const checkboxEl = document.getElementById(
      'debug-input'
    ) as HTMLInputElement;
    checkboxEl.addEventListener('change', (e) => this.onChange(e));

    if (this.enabled) {
      checkboxEl.setAttribute('checked', this.enabled + '');
    }

    this.debugLayers.forEach((layer) => this.game.canvas.addLayer(layer));
  }

  private onChange(e: Event) {
    this.enabled = (<HTMLInputElement>e.target).checked;
    this.enabled ? this.tileSelector.show() : this.tileSelector.hide();
  }
}
