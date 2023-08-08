import css from '../styles.css';
import { Debug } from './debug';
import { Game } from './game';

/**
 * Provide debugger
 */
export const DEBUG = new Debug();

/**
 * Load styles
 */
css;

/**
 * Start the game
 */
Game.run();
