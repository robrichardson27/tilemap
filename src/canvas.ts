import { DEBUG } from './app';

export interface CanvasLayerOptions {
  id: string;
  hide: boolean;
  /**
   * Layer order 0 = top
   */
  layer: number;
}

export interface CanvasLayer {
  id: string;
  hide: boolean;
  layer: number;
  render(context: CanvasRenderingContext2D, tick?: number): void;
  debug(context: CanvasRenderingContext2D): void;
}

/**
 * Holds reference to the HTML canvas, context and layer abstraction
 */
export class Canvas {
  static Width = 640;
  static Height = 640;

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
    // TODO: Refactor this, not efficient to sort on every render!
    return Array.from(this.layers.values()).sort((a, b) => b.layer - a.layer);
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
    this.getLayers().forEach((layer) => {
      if (!layer.hide) {
        layer.render(this.context, tick);
        if (DEBUG.enabled) {
          layer.debug(this.context);
        }
      }
    });
  }
}
