import playerGrunt1 from '../../../assets/audio/player-grunt-1.ogg';
import playerGrunt2 from '../../../assets/audio/player-grunt-2.ogg';
import playerGrunt3 from '../../../assets/audio/player-grunt-3.ogg';
import playerGrunt4 from '../../../assets/audio/player-grunt-4.ogg';
import playerSword1 from '../../../assets/audio/player-sword-1.ogg';
import playerSword2 from '../../../assets/audio/player-sword-2.ogg';
import playerSword3 from '../../../assets/audio/player-sword-3.ogg';
import playerSword4 from '../../../assets/audio/player-sword-4.ogg';
import playerRunning from '../../../assets/audio/player-running.ogg';

import { getRandomInt } from '../../utils';

const playerPainAudio = [
  new Audio(playerGrunt1),
  new Audio(playerGrunt2),
  new Audio(playerGrunt3),
  new Audio(playerGrunt4),
];

const playerSwordAudio = [
  new Audio(playerSword1),
  new Audio(playerSword2),
  new Audio(playerSword3),
  new Audio(playerSword4),
];

const playerRunningAudio = new Audio(playerRunning);

export const playPlayerPainAudio = () => {
  const audio = playerPainAudio[getRandomInt(playerPainAudio.length)];
  audio.volume = 0.4;
  audio.play();
};

export const playPlayerSwordAudio = () => {
  const audio = playerSwordAudio[getRandomInt(playerSwordAudio.length)];
  audio.volume = 0.4;
  audio.play();
};

export const playPlayerRunningAudio = () => {
  const audio = playerRunningAudio;
  audio.volume = 1;
  audio.loop = true;
  audio.play();
};

export const pausePlayerRunningAudio = () => {
  const audio = playerRunningAudio;
  audio.pause();
};
