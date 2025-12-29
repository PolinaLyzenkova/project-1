/**
 * Game State Storage
 * 
 * Persists game state to localStorage so it survives page refreshes and app updates
 */

import { Player, ProfessionCard } from '../game/types';

const GAME_STATE_KEY = 'cashflow_game_state';
const PLAYERS_KEY = 'cashflow_players';
const GAME_PHASE_KEY = 'cashflow_game_phase';

export interface SavedGameState {
  players: Player[];
  currentPlayerIndex: number;
  gamePhase: 'setup' | 'rat_race' | 'fast_track' | 'ended';
  boardSpaces?: unknown[];
  opportunityDeck?: unknown[];
  marketDeck?: unknown[];
  doodadDeck?: unknown[];
  professionDeck?: ProfessionCard[];
}

/**
 * Save game state to localStorage
 */
export function saveGameState(gameState: Partial<SavedGameState>): boolean {
  try {
    const stateToSave: SavedGameState = {
      players: gameState.players || [],
      currentPlayerIndex: gameState.currentPlayerIndex || 0,
      gamePhase: gameState.gamePhase || 'setup',
      professionDeck: gameState.professionDeck || []
    };

    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateToSave));
    
    // Also save individual keys for easier access
    if (gameState.players) {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(gameState.players));
    }
    if (gameState.gamePhase) {
      localStorage.setItem(GAME_PHASE_KEY, gameState.gamePhase);
    }

    return true;
  } catch (error) {
    console.error('Error saving game state:', error);
    return false;
  }
}

/**
 * Load game state from localStorage
 */
export function loadGameState(): SavedGameState | null {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (!savedState) {
      return null;
    }

    return JSON.parse(savedState) as SavedGameState;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

/**
 * Load players from localStorage
 */
export function loadPlayers(): Player[] | null {
  try {
    const savedPlayers = localStorage.getItem(PLAYERS_KEY);
    if (!savedPlayers) {
      return null;
    }

    return JSON.parse(savedPlayers) as Player[];
  } catch (error) {
    console.error('Error loading players:', error);
    return null;
  }
}

/**
 * Load game phase from localStorage
 */
export function loadGamePhase(): 'setup' | 'rat_race' | 'fast_track' | 'ended' | null {
  try {
    const phase = localStorage.getItem(GAME_PHASE_KEY);
    return phase as 'setup' | 'rat_race' | 'fast_track' | 'ended' | null;
  } catch (error) {
    console.error('Error loading game phase:', error);
    return null;
  }
}

/**
 * Clear all saved game state
 */
export function clearGameState(): boolean {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
    localStorage.removeItem(PLAYERS_KEY);
    localStorage.removeItem(GAME_PHASE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing game state:', error);
    return false;
  }
}

/**
 * Check if there's a saved game state
 */
export function hasSavedGameState(): boolean {
  return localStorage.getItem(GAME_STATE_KEY) !== null || 
         localStorage.getItem(PLAYERS_KEY) !== null;
}
