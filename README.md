# Cashflow Game

A modern TypeScript + React implementation of the Cashflow board game - a financial education tool that teaches players about passive income, investments, and escaping the "Rat Race."

## 🎮 Game Overview

Cashflow is an interactive board game where players learn financial literacy concepts through gameplay. Players start in the "Rat Race" with jobs and bills, then work to build passive income through investments. The goal is to escape the Rat Race when passive income exceeds expenses, then move to the "Fast Track" to achieve financial dreams.

## 🚀 Features

- **1-6 Player Support**: Local multiplayer with up to 6 players
- **Profession Cards**: Each player gets a random profession with different income/expenses
- **Rat Race Mechanics**: Build passive income through real estate and stock investments
- **Opportunity Cards**: Purchase investment opportunities (small deals & big deals)
- **Market Cards**: Sell assets when market conditions are favorable
- **Doodad Cards**: Unavoidable expenses that affect cash flow
- **Financial Tracking**: Complete balance sheet with assets, liabilities, and net worth
- **Fast Track**: Advanced gameplay after escaping the Rat Race

## 📁 Project Structure

```
1stProject/
├── src/
│   ├── game/                  # Core game logic
│   │   ├── types.ts          # TypeScript interfaces and types
│   │   ├── data.ts           # Static data (cards, professions, board)
│   │   └── utils.ts          # Financial calculations and utilities
│   ├── ui/                    # React components
│   │   ├── GameSetup.tsx     # Player selection and setup
│   │   ├── GameScreen.tsx    # Main game interface
│   │   ├── GameBoard.tsx     # Circular board visualization
│   │   ├── PlayerDashboard.tsx # Player financial dashboard
│   │   └── CardModal.tsx     # Card display dialogs
│   ├── storage/               # Data persistence (optional)
│   │   └── localStorage.ts   # Local storage utilities
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── tests/                     # Test files
│   └── storage.test.ts       # Unit tests
├── index.html                # HTML entry point
└── package.json              # Dependencies
```

## 🎯 Game Mechanics

### Rat Race (Inner Circle)
- **Payday Spaces**: Collect monthly paycheck (income - expenses)
- **Opportunity Spaces**: Draw opportunity cards to purchase investments
- **Market Spaces**: Draw market cards to sell assets
- **Doodads Spaces**: Unavoidable expenses
- **Baby Spaces**: Add children (increases monthly expenses)
- **Downsize Spaces**: Skip 2 turns
- **Charity Spaces**: Donate 10% of income to roll 3 dice next turn
- **Exit Condition**: Passive Income > Total Expenses → Move to Fast Track

### Fast Track (Outer Circle)
- **Cashflow Day**: Collect business income
- **Business Investments**: Purchase businesses
- **Dream Spaces**: Buy your dream or others' dreams
- **Win Condition**: First to buy dream OR reach income goal

### Financial System
- **Cash Flow Calculation**: Monthly Income - (Base Expenses + Child Expenses + Loan Payments)
- **Passive Income**: Sum of all asset monthly incomes
- **Net Worth**: Total Assets - Total Liabilities
- **Loans**: 10% monthly payment (can borrow up to credit limit)

## 🛠️ Setup and Installation

### Prerequisites

- **Node.js** (v18 or higher) - [Upgrade instructions](NODE_UPGRADE_INSTRUCTIONS.md) if needed
- **npm** or **yarn** package manager

### Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm test` - Run test suite
- `npm run test:ui` - Run tests with UI interface

## 🎲 How to Play

1. **Setup Phase:**
   - Add 1-6 players with names and colors
   - Each player is assigned a random profession card
   - Starting cash and financials are set based on profession

2. **Gameplay:**
   - Players take turns rolling dice and moving around the board
   - Land on different spaces with various actions:
     - **Payday**: Collect monthly paycheck
     - **Opportunity**: Buy investments (real estate, stocks)
     - **Market**: Sell assets at favorable prices
     - **Doodads**: Pay unavoidable expenses
     - **Baby**: Add child (increases expenses)
     - **Charity**: Donate for bonus dice roll
   - Build passive income through investments
   - Track cash, expenses, and net worth

3. **Winning:**
   - Escape Rat Race: Passive Income > Total Expenses
   - On Fast Track: Buy your dream OR reach income goal

## 🏗️ Architecture

### Game State Management
- React hooks (`useState`, `useEffect`) manage game state
- Player objects track all financial data
- Board state tracks positions and spaces

### Financial Calculations
- Automatic recalculation of cash flow, passive income, and net worth
- Updates occur after each transaction
- Real-time dashboard updates

### Component Structure
- **GameSetup**: Initial player creation
- **GameScreen**: Main game orchestrator
- **GameBoard**: Visual board representation
- **PlayerDashboard**: Individual player financials
- **CardModal**: Interactive card dialogs

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🎨 Styling

- Modern CSS with CSS variables for theming
- Responsive design (works on desktop and mobile)
- Color-coded player tokens
- Clean, intuitive UI

## 🔄 Future Enhancements

Potential improvements:
- Complete Fast Track implementation
- Dream selection during setup
- Loan management UI
- Asset portfolio view
- Game history/log export
- Save/load game state
- Sound effects and animations
- AI opponents

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

---

**Enjoy learning about financial literacy through gameplay! 💰🎲**
