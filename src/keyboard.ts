export enum Key {
  Left = 'KeyA',
  Right = 'KeyD',
  Up = 'KeyW',
  Down = 'KeyS',
}

interface KeyMap {
  [Key.Left]: boolean;
  [Key.Right]: boolean;
  [Key.Up]: boolean;
  [Key.Down]: boolean;
}

/**
 * Keyboard handler
 */
export class Keyboard {
  private keys: KeyMap = <KeyMap>{};

  constructor(keys: string[]) {
    this.listenForEvents(keys);
  }

  listenForEvents(keys: string[]) {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
    keys.forEach((key) => (this.keys[key as keyof KeyMap] = false));
  }

  onKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;
    if (keyCode in this.keys) {
      event.preventDefault();
      this.keys[keyCode as keyof KeyMap] = true;
    }
  }

  onKeyUp(event: KeyboardEvent) {
    const keyCode = event.code;
    if (keyCode in this.keys) {
      event.preventDefault();
      this.keys[keyCode as keyof KeyMap] = false;
    }
  }

  isDown(keyCode: Key): boolean {
    if (this.keys[keyCode] === undefined) {
      throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this.keys[keyCode];
  }

  isAnyDown(keyCode: Key[]): boolean {
    for (let i = 0; i < keyCode.length; i++) {
      if (this.keys[keyCode[i]]) {
        return true;
      }
    }
    return false;
  }
}
