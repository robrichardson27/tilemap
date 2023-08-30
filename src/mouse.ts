import { Observable, Subject } from 'rxjs';

export class Mouse {
  private _click$ = new Subject<MouseEvent>();
  private _mousedown$ = new Subject<MouseEvent>();
  private _mouseup$ = new Subject<MouseEvent>();

  constructor(canvasEl: HTMLCanvasElement) {
    this.listenForEvents(canvasEl);
  }

  private listenForEvents(canvasEl: HTMLCanvasElement) {
    canvasEl.addEventListener('click', (e: MouseEvent) => {
      this._click$.next(e);
    });
    canvasEl.addEventListener('mousedown', (e: MouseEvent) => {
      this._mousedown$.next(e);
    });
    canvasEl.addEventListener('mouseup', (e: MouseEvent) => {
      this._mouseup$.next(e);
    });
  }

  get click$(): Observable<MouseEvent> {
    return this._click$.asObservable();
  }

  get mousedown$(): Observable<MouseEvent> {
    return this._mousedown$.asObservable();
  }

  get mouseup$(): Observable<MouseEvent> {
    return this._mouseup$.asObservable();
  }
}
