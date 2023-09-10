import { Camera } from '../camera';
import { Canvas } from '../canvas';
import { TileData } from './tile';
import { TileMap } from './tile-map';

export interface TileMapsOptions {
  camera: Camera;
  canvas: Canvas;
}

export class TileMaps {
  private tileMaps = new Map<string, TileMap>();
  private options: TileMapsOptions;

  constructor(options: TileMapsOptions) {
    this.options = options;
  }

  has(id: string): boolean {
    return this.tileMaps.has(id);
  }

  get(id: string): TileMap {
    if (this.tileMaps.has(id)) {
      return this.tileMaps.get(id) as TileMap;
    }
    throw Error('Object not foud');
  }

  set(id: string, tileMap: TileMap): TileMaps {
    this.tileMaps.set(id, tileMap);
    this.options.canvas.addLayer(tileMap);
    return this;
  }

  delete(id: string): TileMaps {
    this.tileMaps.delete(id);
    return this;
  }

  forEach(
    callbackfn: (value: TileMap, key: string, map: Map<string, TileMap>) => void
  ) {
    this.tileMaps.forEach((object, key, objects) => {
      callbackfn(object, key, objects);
    });
  }

  get array(): TileMap[] {
    return Array.from(this.tileMaps.values());
  }

  toJsonString(): string {
    return JSON.stringify(this.array.map((t) => t.tiles));
  }

  /**
   * Create all background tilemap layers
   * @param cols
   * @param rows
   * @param camera
   * @param json
   * @returns
   */
  createBackgrounds(cols: number, rows: number, json: TileData[][]): void {
    json.forEach((layer, index) => {
      const background = TileMap.createBackgroundLayer(
        cols,
        rows,
        this.options.camera,
        layer,
        index
      );
      this.set(background.id, background);
    });
  }
}
