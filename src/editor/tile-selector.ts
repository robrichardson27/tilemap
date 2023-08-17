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
      const styles = `margin-right: 4px; border: solid 2px rgba(0,0,0,0); cursor: pointer; object-fit: cover; object-position: -${
        tile.type * TileMap.TSize
      }px;`;
      swatchEl.style.cssText = styles;
      swatchEl.setAttribute('data-tile', tile.type + '');
      swatchEl.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.ui.append(swatchEl);
    });
  }

  hide() {
    this.ui.style.display = 'none';
  }

  show() {
    this.ui.style.display = 'block';
  }

  getSelectedTile(): Tile | undefined {
    return this.selectedTile;
  }

  private onMouseDown(e: MouseEvent) {
    this.clearSelectedStyle();
    const tileType = parseInt(
      (e.target as HTMLImageElement).getAttribute('data-tile') as string
    );
    (e.target as HTMLImageElement).style.border = '2px solid red';

    this.selectedTile = this.tiles[tileType];
  }

  private clearSelectedStyle(): void {
    this.ui.childNodes.forEach((tile) => {
      (tile as HTMLImageElement).style.border = '2px solid rgba(0,0,0,0)';
    });
  }
}
