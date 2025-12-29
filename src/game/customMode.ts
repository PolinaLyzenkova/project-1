/**
 * Custom Mode Utilities
 * 
 * Functions to apply custom mode multipliers and modifications
 * Custom Mode Rules:
 * - Starting cash: 1.5x
 * - Passive income: 1.2x
 * - Base expenses: 0.8x
 * - Faster progression through Rat Race
 * */

import { ProfessionCard } from './types';

export const CUSTOM_MODE_MULTIPLIERS = {
  STARTING_CASH: 1.5,
  PASSIVE_INCOME: 1.2,
  BASE_EXPENSES: 0.8
};

/**
 * Creates a modified profession card for custom mode
 * Applies multipliers to starting cash and expenses
 */
export function createCustomModeProfession(profession: ProfessionCard): ProfessionCard {
  return {
    ...profession,
    assets: {
      ...profession.assets,
      cash: Math.round(profession.assets.cash * CUSTOM_MODE_MULTIPLIERS.STARTING_CASH)
    },
    expenses: Math.round(profession.expenses * CUSTOM_MODE_MULTIPLIERS.BASE_EXPENSES),
    cashFlow: profession.paycheck - Math.round(profession.expenses * CUSTOM_MODE_MULTIPLIERS.BASE_EXPENSES)
  };
}

/**
 * Applies custom mode passive income multiplier
 */
export function applyCustomModePassiveIncome(income: number): number {
  return Math.round(income * CUSTOM_MODE_MULTIPLIERS.PASSIVE_INCOME);
}

/**
 * Checks if custom mode is active (based on storage or prop)
 */
export function isCustomMode(): boolean {
  return localStorage.getItem('customMode') === 'true';
}

/**
 * Sets custom mode flag
 */
export function setCustomMode(enabled: boolean): void {
  localStorage.setItem('customMode', enabled.toString());
}
