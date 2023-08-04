/**
 * Holds reference to the HTML canvas and context
 */
export class Canvas {
  static Width = 512;
  static Height = 512;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(id: string) {
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    this.canvas.setAttribute('width', Canvas.Width + '');
    this.canvas.setAttribute('height', Canvas.Height + '');
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  get(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.context;
  }
}
