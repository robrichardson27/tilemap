import { GameObjects } from '../game-objects/game-objects';

export class GameObjectExporter {
  static init(gameObjects: GameObjects) {
    (
      document.getElementById('game-object-exporter-btn') as HTMLButtonElement
    ).addEventListener('click', () => GameObjectExporter.export(gameObjects));
  }

  static export(gameObjects: GameObjects) {
    const filename = 'game-objects.json';
    const jsonStr = gameObjects.toJsonString();

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
