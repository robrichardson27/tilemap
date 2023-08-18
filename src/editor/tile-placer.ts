import { DEBUG } from '../app';
import { Camera } from '../camera';
import { Canvas, CanvasLayer, CanvasLayerOptions } from '../canvas';
import { Tile } from '../tile';
import { TileMap } from '../tile-map';
import { TileSelector } from './tile-selector';

export interface TilePlacerOptions extends CanvasLayerOptions {
  tileSelector: TileSelector;
  canvas: Canvas;
  tileMap: TileMap;
}

export class TilePlacer extends CanvasLayer {
  private tileSelector: TileSelector;
  private gameCanvas: HTMLCanvasElement;
  private gameTileMap: TileMap;
  private debugTileMap: TileMap;
  private x: number = 0;
  private y: number = 0;
  private prevCol: number = 0;
  private prevRow: number = 0;
  private camera: Camera;

  constructor(options: TilePlacerOptions) {
    super(options);
    this.tileSelector = options.tileSelector;
    this.gameCanvas = options.canvas.getCanvas();
    this.gameTileMap = options.tileMap;
    this.camera = options.tileMap.camera as Camera;
    const cols = options.tileMap.cols;
    const rows = options.tileMap.rows;
    this.debugTileMap = new TileMap({
      id: 'debug-tile-map',
      hide: false,
      layer: 0,
      tiles: [],
      cols: cols,
      rows: rows,
    });
    this.debugTileMap.setCamera(this.camera as Camera);
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
      this.setTileOnMap(e, this.gameTileMap);
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
      tileMap.setTile(tile, col, row);
    }
  }
}
