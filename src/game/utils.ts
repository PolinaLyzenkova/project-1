/**
 * Game Utility Functions
 * 
 * Financial calculations and game mechanics
 */

import { Player } from './types';

/**
 * Calculates a player's cash flow (income - expenses)
 * Updates the player's monthlyPayday and totalExpenses
 */
export function calculateCashFlow(player: Player): number {
  const monthlyIncome = player.ratRace.monthlyIncome;
  const baseExpenses = player.ratRace.monthlyExpenses;
  const childExpenses = player.ratRace.children * 40;
  const loanPayments = player.ratRace.liabilities.bankLoans.reduce(
    (sum, loan) => sum + loan.monthlyPayment,
    0
  );
  
  const totalExpenses = baseExpenses + childExpenses + loanPayments;
  const monthlyCashFlow = monthlyIncome - totalExpenses;
  
  player.ratRace.totalExpenses = totalExpenses;
  player.ratRace.monthlyPayday = Math.max(0, monthlyCashFlow);
  
  return monthlyCashFlow;
}

/**
 * Calculates a player's total passive income from assets
 */
export function calculatePassiveIncome(player: Player): number {
  let total = 0;
  player.ratRace.assets.realEstate.forEach(re => total += re.monthlyIncome || 0);
  player.ratRace.assets.stocks.forEach(s => total += s.monthlyIncome || 0);
  player.ratRace.assets.businesses.forEach(b => total += b.monthlyIncome || 0);
  
  // Custom mode multiplier is already applied when assets are purchased
  // So we just return the total here
  player.ratRace.passiveIncome = total;
  return total;
}

/**
 * Calculates a player's net worth (assets - liabilities)
 */
export function calculateNetWorth(player: Player): number {
  let assets = 0;
  let liabilities = 0;
  
  // Assets
  assets += player.cash;
  assets += player.ratRace.assets.realEstate.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  assets += player.ratRace.assets.stocks.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  
  // Liabilities
  liabilities += player.ratRace.liabilities.homeLoan;
  liabilities += player.ratRace.liabilities.carLoan;
  liabilities += player.ratRace.liabilities.creditCardDebt;
  liabilities += player.ratRace.liabilities.bankLoans.reduce((sum, l) => sum + l.amount, 0);
  
  player.netWorth = assets - liabilities;
  return player.netWorth;
}

/**
 * Checks if a player can exit the Rat Race
 * Condition: Passive Income > Total Expenses
 */
export function checkRatRaceExit(player: Player): boolean {
  const passive = calculatePassiveIncome(player);
  const expenses = player.ratRace.totalExpenses;
  return passive > expenses;
}

/**
 * Recalculates all financial metrics for a player
 */
export function recalculatePlayerFinances(player: Player): void {
  calculateCashFlow(player);
  calculatePassiveIncome(player);
  calculateNetWorth(player);
}

/**
 * Moves a player on the board
 * Handles wrapping around the board (0-19 for Rat Race)
 */
export function movePlayerOnBoard(player: Player, spaces: number): void {
  if (!player.onFastTrack) {
    // Rat Race: circle of 20 spaces (0-19)
    player.position = (player.position + spaces) % 20;
  } else {
    // Fast Track: also 20 spaces (for now, same logic)
    player.position = (player.position + spaces) % 20;
  }
}

