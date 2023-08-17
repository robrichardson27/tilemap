import { TileMap } from '../tile-map';

export class TileMapExporter {
  constructor(tileMap: TileMap) {
    (
      document.getElementById('tile-map-exporter-btn') as HTMLButtonElement
    ).addEventListener('click', () => this.exportTileMap(tileMap));
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

  exportTileMap(tileMap: TileMap) {
    const filename = tileMap.id + '.json';
    const jsonStr = JSON.stringify(tileMap.tiles);

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
