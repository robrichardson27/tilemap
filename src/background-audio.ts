import waves1 from '../assets/audio/ambience-waves.mp3';
import birds1 from '../assets/audio/ambience-birds.mp3';
import field1 from '../assets/audio/music-field.wav';
import { first, fromEvent } from 'rxjs';

// TODO: link ambience audio to play when certain tiles are in view
export class BackgroundAudio {
  private static wavesAudio = new Audio(waves1);
  private static birdsAudio = new Audio(birds1);
  private static fieldMusic = new Audio(field1);

  static start() {
    // Audio must play after user interaction with DOM
    fromEvent(document, 'click')
      .pipe(first())
      .subscribe(() => {
        BackgroundAudio.playWavesAudio();
        BackgroundAudio.playBirdsAudio();
        BackgroundAudio.playFieldMusic();
      });
  }

  static playWavesAudio() {
    const audio = BackgroundAudio.wavesAudio;
    audio.loop = true;
    audio.volume = 0.1;
    audio.play();
  }

  static playBirdsAudio() {
    const audio = BackgroundAudio.birdsAudio;
    audio.loop = true;
    audio.volume = 1;
    audio.play();
  }

  static playFieldMusic() {
    const audio = BackgroundAudio.fieldMusic;
    audio.loop = true;
    audio.volume = 0.3;
    audio.play();
  }

  static pauseWavesAudio() {
    const audio = BackgroundAudio.wavesAudio;
    audio.pause();
  }

  static pauseBirdsAudio() {
    const audio = BackgroundAudio.birdsAudio;
    audio.pause();
  }

  static pauseFieldMusic() {
    const audio = BackgroundAudio.fieldMusic;
    audio.pause();
  }
}
