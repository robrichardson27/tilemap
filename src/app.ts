import css from '../styles.css';
import { Debugger } from './debugger';
import { Game } from './game';

// Load styles
css;

// Create game
const GAME = new Game();

// Create debugger and inject Game
export const DEBUG = new Debugger(GAME, false);

// Start the game
GAME.start();
