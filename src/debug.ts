export class Debug {
  enabled = true;
  constructor() {
    const checkboxEl = document.getElementById(
      'debug-input'
    ) as HTMLInputElement;
    checkboxEl.addEventListener(
      'change',
      (e) => (this.enabled = (<HTMLInputElement>e.target).checked)
    );
    if (this.enabled) {
      checkboxEl.setAttribute('checked', this.enabled + '');
    }
  }
}
