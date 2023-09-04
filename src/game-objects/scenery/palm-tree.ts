import { Camera } from '../../camera';
import { Point } from '../../utils';
import { SceneryObject } from './scenery-object';
import palmTreeImg1Src from '../../../assets/sprites/tree-palm-1.png';
import palmTreeImg2Src from '../../../assets/sprites/tree-palm-2.png';

let nextId = 0;

export class PalmTree extends SceneryObject {
  static palmTreeId = 'palm-tree-';

  constructor(pos: Point, camera: Camera) {
    const palm1 = nextId % 2 > 0;
    super({
      id: PalmTree.palmTreeId + nextId++,
      hide: false,
      layer: 1,
      x: pos.x + (palm1 ? 29 : 11),
      y: pos.y + 42,
      width: 24,
      height: 50,
      srcX: 0,
      srcY: 0,
      camera: camera,
      imgSrc: palm1 ? palmTreeImg1Src : palmTreeImg2Src,
      renderX: pos.x,
      renderY: pos.y,
      renderWidth: 64,
      renderHeight: 92,
    });
  }

  override render(context: CanvasRenderingContext2D): void {
    this.renderShadow(context);
    super.render(context);
  }

  private renderShadow(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.ellipse(
      this.x - this.camera.x + this.width / 2,
      this.y - this.camera.y + this.height - 2,
      18,
      5,
      0,
      0,
      180
    );
    context.fill();
  }
}
