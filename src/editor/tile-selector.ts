import { TileData } from '../tile-maps/tile';
import tileMapPng from '../../assets/sprites/tile-map.png';
import tileMapJson from '../../assets/data/tile-map.json';
import { TileMap } from '../tile-maps/tile-map';

export class TileSelector {
  private ui: HTMLDivElement;
  private tiles: TileData[] = [];
  private tilemapImg = new Image();
  private selectedTile: TileData | undefined;

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
        tile.index * TileMap.TSize
      }px;`;
      swatchEl.style.cssText = styles;
      swatchEl.setAttribute('data-tile', tile.index + '');
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

  getSelectedTile(): TileData | undefined {
    return this.selectedTile;
  }

  private onMouseDown(e: MouseEvent) {
    this.clearSelectedStyle();
    const tileIndex = parseInt(
      (e.target as HTMLImageElement).getAttribute('data-tile') as string
    );
    (e.target as HTMLImageElement).style.border = '2px solid red';

    this.selectedTile = this.tiles[tileIndex];
  }

  private clearSelectedStyle(): void {
    this.ui.childNodes.forEach((tile) => {
      if (tile instanceof HTMLImageElement) {
        (tile as HTMLImageElement).style.border = '2px solid rgba(0,0,0,0)';
      }
    });
  }
}
