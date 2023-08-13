import { Tile, TileHelper } from '../tile';
import tileMapPng from '../../assets/tile-map.png';
import { TileMap } from '../tile-map';
import tileMapJson from '../../assets/tile-map.json';
import { DEBUG } from '../app';

export class TileSelector {
  static Width = 512;
  static Height = 512;
  static Cols = 8;
  static Rows = 8;
  private tiles: Tile[] = [];
  private tilemapImg = new Image();
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private tilemap!: TileMap;
  private hoverX: number = 0;
  private hoverY: number = 0;
  private hoverTile: Tile | undefined;
  private selectedTile: Tile | undefined;

  constructor() {
    // TODO: this can just be an HTML UI element not a canvas
    this.canvas = document.getElementById('tile-selector') as HTMLCanvasElement;
    this.canvas.setAttribute('width', TileSelector.Width + '');
    this.canvas.setAttribute('height', TileSelector.Height + '');
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.tilemapImg.src = tileMapPng;
    this.tiles = tileMapJson;
    this.tilemap = new TileMap({
      id: 'tile-selector',
      hide: !DEBUG.enabled,
      tiles: this.tiles,
      cols: TileSelector.Cols,
      rows: TileSelector.Rows,
    });
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  getSelectedTile(): Tile | undefined {
    return this.selectedTile;
  }

  onMouseDown() {
    if (this.hoverTile !== undefined) {
      this.selectedTile = { ...this.hoverTile };
      console.log(this.selectedTile);
    }
  }

  onMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.hoverX = Math.round(e.clientX - rect.left);
    this.hoverY = Math.round(e.clientY - rect.top);
    const col = Math.floor(this.hoverX / TileMap.TSize);
    const row = Math.floor(this.hoverY / TileMap.TSize);
    const tile = TileHelper.getTile(this.tilemap, col, row);
    if (tile.type !== undefined) {
      this.hoverTile = tile;
      this.canvas.style.cssText = 'cursor: pointer;';
    } else {
      this.hoverTile = undefined;
      this.canvas.style.cssText = 'cursor: auto;';
    }
  }

  render() {
    this.tilemap.render(this.context);
    if (this.hoverTile) {
      this.context.beginPath();
      this.context.strokeStyle = 'red';
      this.context.lineWidth = 2;
      this.context.strokeRect(
        this.hoverTile.x,
        this.hoverTile.y,
        TileMap.TSize,
        TileMap.TSize
      );
      this.context.closePath();
    }
    if (this.selectedTile) {
      this.context.beginPath();
      this.context.strokeStyle = 'red';
      this.context.lineWidth = 2;
      this.context.strokeRect(
        this.selectedTile.x,
        this.selectedTile.y,
        TileMap.TSize,
        TileMap.TSize
      );
      this.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
      this.context.fillRect(
        this.selectedTile.x,
        this.selectedTile.y,
        TileMap.TSize,
        TileMap.TSize
      );
      this.context.closePath();
    }
  }

  clear() {
    this.context.clearRect(0, 0, TileSelector.Width, TileSelector.Height);
  }
}
