/**
 * Game Type Definitions
 * 
 * All TypeScript interfaces and types for the Cashflow game
 */

// Player Financial Data Structures
export interface RealEstateAsset {
  id: string;
  name: string;
  downPayment: number;
  totalCost: number;
  monthlyIncome: number;
  currentValue: number;
}

export interface StockAsset {
  id: string;
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentValue: number;
  monthlyIncome: number;
}

export interface BusinessAsset {
  id: string;
  name: string;
  cost: number;
  monthlyIncome: number;
}

export interface BankLoan {
  id: string;
  amount: number;
  monthlyPayment: number;
  dateCreated: number;
}

export interface RatRaceFinancials {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyPayday: number; // income - expenses
  passiveIncome: number;
  totalExpenses: number;
  children: number;
  creditLimit: number;
  auditorId: string | null;
  assets: {
    realEstate: RealEstateAsset[];
    stocks: StockAsset[];
    businesses: BusinessAsset[];
    cash: number;
  };
  liabilities: {
    homeLoan: number;
    carLoan: number;
    creditCardDebt: number;
    bankLoans: BankLoan[];
  };
}

export interface FastTrackFinancials {
  buyout: number; // 100 × (passive income - total expenses)
  incomeGoal: number; // buyout + $50,000
  currentIncome: number;
  businesses: Array<{
    id: string;
    name: string;
    cost: number;
    monthlyIncome: number;
    owned: boolean;
  }>;
  dreamPrice: number;
  dreamPriceMultiplier: number;
}

// Main Player Object
export interface Player {
  id: string;
  name: string;
  profession: string | null;
  color: string;
  position: number; // 0-19 (Rat Race), 0-19 (Fast Track)
  onFastTrack: boolean;
  ratRace: RatRaceFinancials;
  fastTrack: FastTrackFinancials;
  cash: number;
  netWorth: number;
  status: 'active' | 'eliminated' | 'won';
  hasCharityBonus: boolean;
  rolledDice: number[];
  passesThisTurn: number;
}

// Profession Card
export interface ProfessionCard {
  id: number;
  name: string;
  career: string;
  salary: number;
  paycheck: number; // monthly income
  expenses: number;
  cashFlow: number; // income - expenses
  assets: {
    realEstate: number;
    stocks: number;
    cash: number;
  };
  liabilities: {
    homeMortgage: number;
    carLoan: number;
    creditCard: number;
    studentLoan: number;
  };
  creditLimit: number;
}

// Board Space
export interface BoardSpace {
  id: number;
  name: string;
  type: 'payday' | 'opportunity' | 'market' | 'doodads' | 'baby' | 'downsize' | 'charity' | 'cashflow' | 'business' | 'dream' | 'market_event' | 'exit';
  position: number;
  circleType: 'rat_race' | 'fast_track';
  data?: {
    amount?: number;
    opportunity?: unknown;
    dreamName?: string;
    dreamPrice?: number;
    businessName?: string;
    businessIncome?: number;
  };
}

// Opportunity Card
export interface OpportunityCard {
  id: number;
  name: string;
  type: 'small_deal' | 'big_deal';
  downPayment: number;
  totalCost: number;
  monthlyIncome: number;
  totalValue: number;
  description: string;
  buyable: boolean;
}

// Market Card
export interface MarketCard {
  id: number;
  assetType: 'real_estate' | 'stocks' | 'business';
  assetName: string;
  sellingPrice: number;
  description: string;
}

// Doodad Card
export interface DoodadCard {
  id: number;
  name: string;
  cost: number;
  expenseIncrease: number; // permanent monthly expense increase
  description: string;
}

// Game State
export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  gamePhase: 'setup' | 'rat_race' | 'fast_track' | 'ended';
  boardSpaces: BoardSpace[];
  opportunityDeck: OpportunityCard[];
  marketDeck: MarketCard[];
  doodadDeck: DoodadCard[];
  professionDeck: ProfessionCard[];
}

