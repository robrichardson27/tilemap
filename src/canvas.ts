export interface Render2D {
  render(context: CanvasRenderingContext2D, tick?: number): void;
}

export interface CanvasLayerOptions {
  id: string;
  hide: boolean;
  /**
   * Layer order 0 = top
   */
  layer: number;
}

export abstract class CanvasLayer implements Render2D {
  id: string;
  hide: boolean;
  abstract render(context: CanvasRenderingContext2D, tick?: number): void;
  constructor(options: CanvasLayerOptions) {
    this.id = options.id;
    this.hide = options.hide;
  }
}

/**
 * Holds reference to the HTML canvas, context and layer abstraction
 */
export class Canvas {
  static Width = 512;
  static Height = 512;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private layers: Map<string, CanvasLayer> = new Map();

  constructor(domId: string) {
    this.canvas = document.getElementById(domId) as HTMLCanvasElement;
    this.canvas.setAttribute('width', Canvas.Width + '');
    this.canvas.setAttribute('height', Canvas.Height + '');
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  clear() {
    this.context.clearRect(0, 0, Canvas.Width, Canvas.Height);
  }

  getLayers(): CanvasLayer[] {
    return Array.from(this.layers.values());
  }

  addLayer(layer: CanvasLayer): Canvas {
    if (this.layers.has(layer.id)) {
      console.warn(`Canvas layer ${layer.id} already exists`);
    } else {
      this.layers.set(layer.id, layer);
    }
    return this;
  }

  removeLayer(id: string) {
    this.layers.delete(id);
  }

  render(tick: number) {
    this.layers.forEach((layer) => {
      if (!layer.hide) {
        layer.render(this.context, tick);
      }
    });
  }
}
