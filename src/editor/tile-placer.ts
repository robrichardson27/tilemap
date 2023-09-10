import { DEBUG } from '../app';
import { Camera } from '../camera';
import { CanvasLayer, CanvasLayerOptions } from '../canvas';
import { Game } from '../game';
import { Tile } from '../tile-maps/tile';
import { TileMap } from '../tile-maps/tile-map';
import { TileMaps } from '../tile-maps/tile-maps';
import { TileSelector } from './tile-selector';

export interface TilePlacerOptions extends CanvasLayerOptions {
  tileSelector: TileSelector;
  game: Game;
}

export class TilePlacer implements CanvasLayer {
  id: string;
  hide: boolean;
  layer: number;

  private tileSelector: TileSelector;
  private gameCanvas: HTMLCanvasElement;
  private gameTileMaps: TileMaps;
  private debugTileMap: TileMap;
  private x: number = 0;
  private y: number = 0;
  private prevCol: number = 0;
  private prevRow: number = 0;
  private camera: Camera;

  constructor(options: TilePlacerOptions) {
    this.id = options.id;
    this.hide = options.hide;
    this.layer = options.layer;
    this.tileSelector = options.tileSelector;
    this.gameCanvas = options.game.canvas.getCanvas();
    this.gameTileMaps = options.game.tileMaps;
    this.camera = options.game.camera;
    const cols = options.game.tileMaps.array[0].cols;
    const rows = options.game.tileMaps.array[0].rows;
    this.debugTileMap = new TileMap({
      id: 'debug-tile-map',
      hide: false,
      layer: 0,
      tiles: [],
      cols: cols,
      rows: rows,
      camera: this.camera,
    });
    this.gameCanvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.gameCanvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.gameCanvas.addEventListener(
      'mouseleave',
      this.onMouseLeave.bind(this)
    );
  }

  render(context: CanvasRenderingContext2D) {
    if (DEBUG.enabled) {
      this.debugTileMap.render(context);
    }
  }

  onMouseDown(e: MouseEvent) {
    if (DEBUG.enabled && e.button === 0) {
      const layerId = (
        document.getElementById('tile-layer-select') as HTMLSelectElement
      ).value;
      this.setTileOnMap(e, this.gameTileMaps.get(layerId));
    }
  }

  onMouseMove(e: MouseEvent) {
    if (DEBUG.enabled) {
      const col = Math.floor(this.x / TileMap.TSize);
      const row = Math.floor(this.y / TileMap.TSize);

      if (this.prevCol !== col || this.prevRow !== row) {
        this.debugTileMap.setTile(<Tile>{}, this.prevCol, this.prevRow);
      } else {
        this.setTileOnMap(e, this.debugTileMap);
      }

      this.prevCol = col;
      this.prevRow = row;
    }
  }

  onMouseLeave() {
    this.debugTileMap.setTile(<Tile>{}, this.prevCol, this.prevRow);
  }

  private setTileOnMap(e: MouseEvent, tileMap: TileMap) {
    const rect = this.gameCanvas.getBoundingClientRect();

    this.x = Math.round(e.clientX - rect.left) + this.camera.x;
    this.y = Math.round(e.clientY - rect.top) + this.camera.y;

    const col = Math.floor(this.x / TileMap.TSize);
    const row = Math.floor(this.y / TileMap.TSize);

    const tile = this.tileSelector.getSelectedTile();

    if (tile) {
      tileMap.setTile(<Tile>tile, col, row);
    }
  }

  debug(): void {
    // Not implemented
  }
}
