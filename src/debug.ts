export class Debug {
  enabled = false;
  constructor() {
    const checkboxEl = document.getElementById(
      'debug-input'
    ) as HTMLInputElement;
    checkboxEl.addEventListener(
      'change',
      (e) => (this.enabled = (<HTMLInputElement>e.target).checked)
    );
  }
}
