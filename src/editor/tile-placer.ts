import { Canvas, CanvasLayer, CanvasLayerOptions } from '../canvas';
import { TileMap } from '../tile-map';
import { TileSelector } from './tile-selector';

export interface TilePlacerOptions extends CanvasLayerOptions {
  tileSelector: TileSelector;
  canvas: Canvas;
  tileMap: TileMap;
}

export class TilePlacer extends CanvasLayer {
  private tileSelector!: TileSelector;
  private gameCanvas!: HTMLCanvasElement;
  private gameTileMap!: TileMap;
  private hoverX: number = 0;
  private hoverY: number = 0;
  private prevCol: number | undefined;
  private prevRow: number | undefined;

  constructor(options: TilePlacerOptions) {
    super(options);
    this.tileSelector = options.tileSelector;
    this.gameCanvas = options.canvas.getCanvas();
    this.gameTileMap = options.tileMap;
    this.gameCanvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.gameCanvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.gameCanvas.style.cssText = 'cursor: pointer;';
  }

  render(context: CanvasRenderingContext2D) {
    context;
  }

  onMouseDown() {}

  onMouseMove(e: MouseEvent) {
    const rect = this.gameCanvas.getBoundingClientRect();
    console.log(rect);

    this.hoverX = Math.round(e.clientX - rect.left);
    this.hoverY = Math.round(e.clientY - rect.top);
    const col = Math.floor(this.hoverX / TileMap.TSize);
    const row = Math.floor(this.hoverY / TileMap.TSize);

    this.prevCol = col;
    this.prevRow = row;

    // Unset previous hoveredTile
    if (this.prevCol !== col && this.prevRow !== row) {
      // this.gameTileMap.setTile(<Tile>{}, col, row);
    } else {
      // TODO: factor in camera!
      // Set hovered tile
      const tile = this.tileSelector.getSelectedTile();
      if (tile) {
        this.gameTileMap.setTile(tile, col, row);
      }
    }
  }
}
