import { Tile } from '../tile';
import tileMapPng from '../../assets/tile-map.png';
import tileMapJson from '../../assets/tile-map.json';
import { TileMap } from '../tile-map';

export class TileSelector {
  private ui: HTMLDivElement;
  private tiles: Tile[] = [];
  private tilemapImg = new Image();
  private selectedTile: Tile | undefined;

  constructor() {
    this.ui = document.getElementById('tile-selector') as HTMLDivElement;
    this.tilemapImg.src = tileMapPng;
    this.tiles = tileMapJson;
    // Create tile swatches
    this.tiles.forEach((tile) => {
      const swatchEl = document.createElement('img');
      swatchEl.src = tileMapPng;
      swatchEl.width = TileMap.TSize;
      swatchEl.height = TileMap.TSize;
      const styles = `margin-right: 4px; cursor: pointer; object-fit: cover; object-position: -${
        tile.type * TileMap.TSize
      }px;`;
      swatchEl.style.cssText = styles;
      swatchEl.setAttribute('data-tile', tile.type + '');
      swatchEl.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.ui.append(swatchEl);
    });
  }

  hide() {
    this.ui.style.cssText = 'display: none;';
  }

  show() {
    this.ui.style.cssText = 'display: block;';
  }

  getSelectedTile(): Tile | undefined {
    return this.selectedTile;
  }

  private onMouseDown(e: MouseEvent) {
    const tileType = parseInt(
      (e.target as HTMLImageElement).getAttribute('data-tile') as string
    );
    this.selectedTile = this.tiles[tileType];
  }
}
