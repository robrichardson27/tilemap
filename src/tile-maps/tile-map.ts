import { Camera } from '../camera';
import { Tile, TileData, TileHelper, TileType } from './tile';
import tileMapPng from '../../assets/sprites/tile-map.png';
import { CanvasLayer, CanvasLayerOptions } from '../canvas';

export interface TileMapOptions extends CanvasLayerOptions {
  tiles: TileData[];
  cols: number;
  rows: number;
  camera: Camera;
}

/**
 * TileMap holds enum for tile types and helper to get a tile
 */
export class TileMap implements CanvasLayer {
  static TSize = 64;

  /**
   * Creates an empty tilemap
   * @param cols
   * @param rows
   * @returns
   */
  static createEmptyTiles(cols: number, rows: number): TileData[] {
    const tiles: Tile[] = [];

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        tiles.push(<Tile>{ type: TileType.Empty });
      }
    }

    return tiles;
  }

  static BackgroundId = 'background-';
  /**
   * Creates a single background tilemap layer
   * @param cols
   * @param rows
   * @returns
   */
  static createBackgroundLayer(
    cols: number,
    rows: number,
    camera: Camera,
    json: TileData[],
    index: number
  ): TileMap {
    const tiles = TileMap.createEmptyTiles(cols, rows);
    tiles.splice(0, json.length, ...json);
    return new TileMap({
      id: TileMap.BackgroundId + index,
      hide: false,
      layer: 999 - index,
      tiles: tiles,
      cols: cols,
      rows: rows,
      camera: camera,
    });
  }

  id: string;
  hide: boolean;
  layer: number;
  tiles: TileData[];
  cols: number;
  rows: number;
  camera: Camera;
  tileMapImage: HTMLImageElement;
  startCol: number = 0;
  endCol: number = 0;
  startRow: number = 0;
  endRow: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;

  context!: CanvasRenderingContext2D;

  constructor(options: TileMapOptions) {
    this.id = options.id;
    this.hide = options.hide;
    this.layer = options.layer;
    this.tiles = options.tiles;
    this.cols = options.cols;
    this.rows = options.rows;
    this.camera = options.camera;
    this.tileMapImage = new Image();
    this.tileMapImage.src = tileMapPng;
  }

  setTile(tile: Tile, col: number, row: number) {
    this.tiles[row * this.cols + col] = tile;
  }

  render(context: CanvasRenderingContext2D) {
    this.context = context;
    if (this.camera) {
      this.startCol = Math.floor(this.camera.x / TileMap.TSize);
      this.endCol = Math.ceil(
        this.startCol + this.camera.width / TileMap.TSize
      );
      this.startRow = Math.floor(this.camera.y / TileMap.TSize);
      this.endRow = Math.ceil(
        this.startRow + this.camera.height / TileMap.TSize
      );
      this.offsetX = -this.camera.x + this.startCol * TileMap.TSize;
      this.offsetY = -this.camera.y + this.startRow * TileMap.TSize;

      for (let c = this.startCol; c <= this.endCol; c++) {
        for (let r = this.startRow; r <= this.endRow; r++) {
          // TODO: refactor TileHelper
          TileHelper.render(this, c, r);
        }
      }
    }
  }

  debug(): void {
    // Not implemented
  }
}
