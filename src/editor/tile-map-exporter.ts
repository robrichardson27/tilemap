import { TileMaps } from '../tile-maps/tile-maps';

export class TileMapExporter {
  constructor(tileMaps: TileMaps) {
    (
      document.getElementById('tile-map-exporter-btn') as HTMLButtonElement
    ).addEventListener('click', () => this.exportTileMap(tileMaps));
  }

  show() {
    (
      document.getElementById('tile-map-exporter') as HTMLDivElement
    ).style.display = 'block';
  }

  hide() {
    (
      document.getElementById('tile-map-exporter') as HTMLDivElement
    ).style.display = 'none';
  }

  exportTileMap(tileMaps: TileMaps) {
    const filename = 'background.json';
    const jsonStr = tileMaps.toJsonString();

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr)
    );
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
