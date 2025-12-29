/**
 * Game Data
 * 
 * Static data for professions, cards, and board spaces
 */

import { ProfessionCard, BoardSpace, OpportunityCard, DoodadCard, MarketCard } from './types';

// Profession Cards
export const PROFESSION_CARDS: ProfessionCard[] = [
  {
    id: 1,
    name: 'Doctor',
    career: 'Medical Doctor',
    salary: 12000,
    paycheck: 12000,
    expenses: 4200,
    cashFlow: 7800,
    assets: { realEstate: 68000, stocks: 35400, cash: 1000 },
    liabilities: { homeMortgage: 192000, carLoan: 25000, creditCard: 2000, studentLoan: 8000 },
    creditLimit: 3500
  },
  {
    id: 2,
    name: 'Lawyer',
    career: 'Attorney',
    salary: 7500,
    paycheck: 7500,
    expenses: 2700,
    cashFlow: 4800,
    assets: { realEstate: 40000, stocks: 10000, cash: 500 },
    liabilities: { homeMortgage: 100000, carLoan: 15000, creditCard: 1500, studentLoan: 6000 },
    creditLimit: 2500
  },
  {
    id: 3,
    name: 'Teacher',
    career: 'School Teacher',
    salary: 3500,
    paycheck: 3500,
    expenses: 1600,
    cashFlow: 1900,
    assets: { realEstate: 15000, stocks: 5000, cash: 300 },
    liabilities: { homeMortgage: 50000, carLoan: 8000, creditCard: 500, studentLoan: 3000 },
    creditLimit: 1000
  },
  {
    id: 4,
    name: 'Engineer',
    career: 'Software Engineer',
    salary: 5500,
    paycheck: 5500,
    expenses: 2100,
    cashFlow: 3400,
    assets: { realEstate: 25000, stocks: 15000, cash: 800 },
    liabilities: { homeMortgage: 70000, carLoan: 12000, creditCard: 1000, studentLoan: 5000 },
    creditLimit: 2000
  },
  {
    id: 5,
    name: 'Janitor',
    career: 'Custodian',
    salary: 2000,
    paycheck: 2000,
    expenses: 900,
    cashFlow: 1100,
    assets: { realEstate: 5000, stocks: 0, cash: 200 },
    liabilities: { homeMortgage: 20000, carLoan: 3000, creditCard: 200, studentLoan: 0 },
    creditLimit: 500
  },
  {
    id: 6,
    name: 'Secretary',
    career: 'Administrative Assistant',
    salary: 2500,
    paycheck: 2500,
    expenses: 1100,
    cashFlow: 1400,
    assets: { realEstate: 8000, stocks: 2000, cash: 300 },
    liabilities: { homeMortgage: 35000, carLoan: 5000, creditCard: 300, studentLoan: 1000 },
    creditLimit: 800
  }
];

// Rat Race Board Spaces
export const RAT_RACE_BOARD: BoardSpace[] = [
  { id: 0, name: 'Payday', type: 'payday', position: 0, circleType: 'rat_race' },
  { id: 1, name: 'Opportunity', type: 'opportunity', position: 1, circleType: 'rat_race' },
  { id: 2, name: 'Market', type: 'market', position: 2, circleType: 'rat_race' },
  { id: 3, name: 'Doodads', type: 'doodads', position: 3, circleType: 'rat_race' },
  { id: 4, name: 'Opportunity', type: 'opportunity', position: 4, circleType: 'rat_race' },
  { id: 5, name: 'Baby', type: 'baby', position: 5, circleType: 'rat_race' },
  { id: 6, name: 'Downsize', type: 'downsize', position: 6, circleType: 'rat_race' },
  { id: 7, name: 'Opportunity', type: 'opportunity', position: 7, circleType: 'rat_race' },
  { id: 8, name: 'Market', type: 'market', position: 8, circleType: 'rat_race' },
  { id: 9, name: 'Charity', type: 'charity', position: 9, circleType: 'rat_race' },
  { id: 10, name: 'Doodads', type: 'doodads', position: 10, circleType: 'rat_race' },
  { id: 11, name: 'Opportunity', type: 'opportunity', position: 11, circleType: 'rat_race' },
  { id: 12, name: 'Market', type: 'market', position: 12, circleType: 'rat_race' },
  { id: 13, name: 'Opportunity', type: 'opportunity', position: 13, circleType: 'rat_race' },
  { id: 14, name: 'Baby', type: 'baby', position: 14, circleType: 'rat_race' },
  { id: 15, name: 'Doodads', type: 'doodads', position: 15, circleType: 'rat_race' },
  { id: 16, name: 'Opportunity', type: 'opportunity', position: 16, circleType: 'rat_race' },
  { id: 17, name: 'Market', type: 'market', position: 17, circleType: 'rat_race' },
  { id: 18, name: 'Opportunity', type: 'opportunity', position: 18, circleType: 'rat_race' },
  { id: 19, name: 'Exit to Fast Track', type: 'exit', position: 19, circleType: 'rat_race' }
];

// Opportunity Cards
export const OPPORTUNITY_CARDS: OpportunityCard[] = [
  {
    id: 1,
    name: '8-Plex Apartment Building',
    type: 'small_deal',
    downPayment: 5000,
    totalCost: 50000,
    monthlyIncome: 500,
    totalValue: 50000,
    description: '8-unit apartment building with good rental income potential.',
    buyable: true
  },
  {
    id: 2,
    name: '4-Plex Apartment Building',
    type: 'small_deal',
    downPayment: 3000,
    totalCost: 30000,
    monthlyIncome: 300,
    totalValue: 30000,
    description: '4-unit apartment building in a growing neighborhood.',
    buyable: true
  },
  {
    id: 3,
    name: '24-Plex Apartment Building',
    type: 'big_deal',
    downPayment: 20000,
    totalCost: 200000,
    monthlyIncome: 2000,
    totalValue: 200000,
    description: 'Large apartment complex with excellent cash flow.',
    buyable: true
  },
  {
    id: 4,
    name: '100 Shares of MYT4U',
    type: 'small_deal',
    downPayment: 1000,
    totalCost: 5000,
    monthlyIncome: 0,
    totalValue: 5000,
    description: 'Stock investment opportunity. Price may fluctuate.',
    buyable: true
  },
  {
    id: 5,
    name: '3-Bedroom House',
    type: 'small_deal',
    downPayment: 2000,
    totalCost: 40000,
    monthlyIncome: 400,
    totalValue: 40000,
    description: 'Single-family rental property in a stable neighborhood.',
    buyable: true
  }
];

// Doodad Cards
export const DOODAD_CARDS: DoodadCard[] = [
  {
    id: 1,
    name: 'Car Accident',
    cost: 2500,
    expenseIncrease: 0,
    description: 'Medical bills from car accident. Pay immediately.'
  },
  {
    id: 2,
    name: 'Speeding Ticket',
    cost: 200,
    expenseIncrease: 0,
    description: 'Pay the fine immediately.'
  },
  {
    id: 3,
    name: 'Boat Purchase',
    cost: 5000,
    expenseIncrease: 300,
    description: 'You bought a boat! Monthly expenses increase by $300.'
  },
  {
    id: 4,
    name: 'Vacation',
    cost: 3000,
    expenseIncrease: 0,
    description: 'Family vacation costs. Pay immediately.'
  },
  {
    id: 5,
    name: 'New Car',
    cost: 8000,
    expenseIncrease: 400,
    description: 'You bought a new car! Monthly expenses increase by $400.'
  }
];

// Market Cards
export const MARKET_CARDS: MarketCard[] = [
  {
    id: 1,
    assetType: 'real_estate',
    assetName: 'Apartment Building',
    sellingPrice: 55000,
    description: 'Apartment building price has increased!'
  },
  {
    id: 2,
    assetType: 'stocks',
    assetName: 'MYT4U Stock',
    sellingPrice: 6000,
    description: 'Stock prices are up!'
  },
  {
    id: 3,
    assetType: 'real_estate',
    assetName: '3-Bedroom House',
    sellingPrice: 45000,
    description: 'House prices have increased in your area!'
  }
];

// Player Colors
export const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

// Utility function to shuffle arrays
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Utility function to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Utility function for random integers
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}

