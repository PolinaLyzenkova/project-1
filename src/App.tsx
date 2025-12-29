/**
 * Main Application Component
 * 
 * Cashflow Game - Main application coordinator
 * Handles game setup and game screen transitions
 * Persists game state to survive page refreshes
 */

import { useState, useEffect } from 'react';
import { GameSetup } from './ui/GameSetup';
import { GameScreen } from './ui/GameScreen';
import IssueTracker from './ui/Tab3';
import { Tab4 } from './ui/Tab4';
import { Tab5 } from './ui/Tab5';
import { Tab6 } from './ui/Tab6';
import { Tab7 } from './ui/Tab7';
import { Tab8 } from './ui/Tab8';
import { Tab9 } from './ui/Tab9';
import { Tab10 } from './ui/Tab10';
import { Player, ProfessionCard } from './game/types';
import { 
  loadGameState, 
  loadPlayers, 
  loadGamePhase,
  clearGameState,
  hasSavedGameState
} from './storage/gameState';

/**
 * App Component
 * Main application component that orchestrates game flow
 */
function App() {
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing'>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [professions, setProfessions] = useState<ProfessionCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('Game');
  
  // Custom mode state (for Tab 2)
  const [customGamePhase, setCustomGamePhase] = useState<'setup' | 'playing'>('setup');
  const [customPlayers, setCustomPlayers] = useState<Player[]>([]);
  const [customProfessions, setCustomProfessions] = useState<ProfessionCard[]>([]);

  /**
   * Load saved game state on component mount
   */
  useEffect(() => {
    const savedState = loadGameState();
    const savedPlayers = loadPlayers();
    const savedPhase = loadGamePhase();

    if (savedState && savedPlayers && savedPlayers.length > 0) {
      setPlayers(savedPlayers);
      setProfessions(savedState.professionDeck || []);
      
      // If there was an active game, resume it
      if (savedPhase && savedPhase !== 'setup' && savedPhase !== 'ended') {
        setGamePhase('playing');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Note: Game state saving is now handled entirely by GameScreen component
  // to avoid circular save/load loops

  /**
   * Handles the start of a new game
   * Called from GameSetup component when players are ready
   */
  const handleStartGame = (initialPlayers: Player[], initialProfessions: ProfessionCard[]) => {
    clearGameState(); // Clear any old saved state
    setPlayers(initialPlayers);
    setProfessions(initialProfessions);
    setGamePhase('playing');
  };

  /**
   * Handles resuming a saved game
   */
  const handleResumeGame = () => {
    const savedState = loadGameState();
    const savedPlayers = loadPlayers();
    
    if (savedState && savedPlayers && savedPlayers.length > 0) {
      setPlayers(savedPlayers);
      setProfessions(savedState.professionDeck || []);
      setGamePhase('playing');
    }
  };

  /**
   * Handles starting a new game (clears saved state)
   */
  const handleNewGame = () => {
    clearGameState();
    setPlayers([]);
    setProfessions([]);
    setGamePhase('setup');
  };

  /**
   * Handles game end (when a player wins)
   */
  const handleGameEnd = (winner: Player) => {
    alert(`🎉 ${winner.name} won the game!`);
    clearGameState();
    // Could reset to setup or show end screen
  };

  if (isLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading game...</div>
      </div>
    );
  }

  /**
   * Handlers for custom mode (Tab 2)
   */
  const handleCustomStartGame = (initialPlayers: Player[], initialProfessions: ProfessionCard[]) => {
    clearGameState(); // Clear any old saved state
    setCustomPlayers(initialPlayers);
    setCustomProfessions(initialProfessions);
    setCustomGamePhase('playing');
  };

  const handleCustomNewGame = () => {
    clearGameState();
    setCustomPlayers([]);
    setCustomProfessions([]);
    setCustomGamePhase('setup');
  };

  const handleCustomGameEnd = (winner: Player) => {
    alert(`🎉 ${winner.name} won the custom mode game!`);
    clearGameState();
  };

  const tabs = ['Game', 'Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6', 'Tab 7', 'Tab 8', 'Tab 9', 'Tab 10'];

  return (
    <div className="app-container">
      <div className="app-tabs">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="tab-content">
        {activeTab === 'Game' && (
          <>
            {gamePhase === 'setup' ? (
              <div id="setup-screen">
                <GameSetup 
                  onStartGame={handleStartGame}
                  hasSavedGame={hasSavedGameState()}
                  onResumeGame={handleResumeGame}
                  onNewGame={handleNewGame}
                />
              </div>
            ) : (
              <div id="game-screen">
                <GameScreen
                  players={players}
                  professions={professions}
                  onGameEnd={handleGameEnd}
                  onPlayersChange={setPlayers}
                  onGamePhaseChange={(phase) => {
                    if (phase === 'ended') {
                      setGamePhase('setup');
                    }
                  }}
                />
              </div>
            )}
          </>
        )}
        {activeTab === 'Tab 2' && (
          <>
            {customGamePhase === 'setup' ? (
              <div id="setup-screen" className="custom-mode">
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  padding: '15px 20px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  color: 'white'
                }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>⚡ Custom Mode</h2>
                  <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
                    Faster gameplay: 1.5x starting cash, 1.2x passive income, 0.8x expenses
                  </p>
                </div>
                <GameSetup 
                  onStartGame={handleCustomStartGame}
                  hasSavedGame={false}
                  onNewGame={handleCustomNewGame}
                />
              </div>
            ) : (
              <div id="game-screen" className="custom-mode">
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  padding: '10px 15px', 
                  borderRadius: '8px', 
                  marginBottom: '10px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}>
                  <strong>⚡ Custom Mode:</strong> 1.5x cash, 1.2x passive income, 0.8x expenses
                </div>
                <GameScreen
                  players={customPlayers}
                  professions={customProfessions}
                  onGameEnd={handleCustomGameEnd}
                  onPlayersChange={setCustomPlayers}
                  customMode={true}
                  onGamePhaseChange={(phase) => {
                    if (phase === 'ended') {
                      setCustomGamePhase('setup');
                    }
                  }}
                />
              </div>
            )}
          </>
        )}
        {activeTab === 'Tab 1' && (
          <div className="tab-panel info-panel">
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
              <h1 style={{ color: 'var(--primary-color)', marginBottom: '30px' }}>📚 Game Rules & Instructions</h1>
              
              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>🎮 How to Play</h2>
                <div style={{ lineHeight: '1.8', color: 'var(--text-dark)' }}>
                  <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Setup Phase</h3>
                  <ul style={{ marginLeft: '20px' }}>
                    <li>Add 1-6 players with names and colors</li>
                    <li>Each player is assigned a random profession card</li>
                    <li>Starting cash and financials are set based on profession</li>
                  </ul>

                  <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Gameplay</h3>
                  <ul style={{ marginLeft: '20px' }}>
                    <li>Players take turns rolling dice and moving around the board</li>
                    <li>Land on different spaces with various actions:
                      <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                        <li><strong>Payday:</strong> Collect monthly paycheck</li>
                        <li><strong>Opportunity:</strong> Buy investments (real estate, stocks)</li>
                        <li><strong>Market:</strong> Sell assets at favorable prices</li>
                        <li><strong>Doodads:</strong> Pay unavoidable expenses</li>
                        <li><strong>Baby:</strong> Add child (increases expenses)</li>
                        <li><strong>Charity:</strong> Donate for bonus dice roll</li>
                      </ul>
                    </li>
                    <li>Build passive income through investments</li>
                    <li>Track cash, expenses, and net worth</li>
                  </ul>

                  <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Winning Conditions</h3>
                  <ul style={{ marginLeft: '20px' }}>
                    <li><strong>Escape Rat Race:</strong> Passive Income &gt; Total Expenses</li>
                    <li><strong>On Fast Track:</strong> Buy your dream OR reach income goal</li>
                  </ul>
                </div>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>💰 Financial Concepts</h2>
                <div style={{ lineHeight: '1.8', color: 'var(--text-dark)' }}>
                  <div style={{ background: 'var(--bg-light)', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
                    <strong>Cash Flow:</strong> Monthly Income - (Base Expenses + Child Expenses + Loan Payments)
                  </div>
                  <div style={{ background: 'var(--bg-light)', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
                    <strong>Passive Income:</strong> Sum of all asset monthly incomes from real estate, stocks, and businesses
                  </div>
                  <div style={{ background: 'var(--bg-light)', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
                    <strong>Net Worth:</strong> Total Assets - Total Liabilities
                  </div>
                </div>
              </section>

              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>⚡ Game Modes</h2>
                <div style={{ lineHeight: '1.8', color: 'var(--text-dark)' }}>
                  <div style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', padding: '20px', borderRadius: '8px', border: '2px solid #667eea' }}>
                    <h3 style={{ marginTop: '0', color: '#667eea' }}>Standard Mode (Game Tab)</h3>
                    <p>Play with original game rules and balanced mechanics.</p>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', padding: '20px', borderRadius: '8px', border: '2px solid #764ba2', marginTop: '15px' }}>
                    <h3 style={{ marginTop: '0', color: '#764ba2' }}>Custom Mode (Tab 2)</h3>
                    <p>Faster gameplay with modified rules:
                      <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                        <li>1.5x starting cash</li>
                        <li>1.2x passive income from investments</li>
                        <li>0.8x base expenses</li>
                      </ul>
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 style={{ color: 'var(--text-dark)', marginBottom: '15px' }}>💡 Tips for Success</h2>
                <div style={{ lineHeight: '1.8', color: 'var(--text-dark)' }}>
                  <ul style={{ marginLeft: '20px' }}>
                    <li>Focus on building passive income early in the game</li>
                    <li>Purchase real estate opportunities that generate positive cash flow</li>
                    <li>Manage your expenses carefully - children and loans add up</li>
                    <li>Use Market cards to sell assets when prices are favorable</li>
                    <li>Build your passive income to exceed your total expenses to escape the Rat Race</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        )}
        {activeTab === 'Tab 3' && <IssueTracker />}
        {activeTab === 'Tab 4' && <Tab4 />}
        {activeTab === 'Tab 5' && <Tab5 />}
        {activeTab === 'Tab 6' && <Tab6 />}
        {activeTab === 'Tab 7' && <Tab7 />}
        {activeTab === 'Tab 8' && <Tab8 />}
        {activeTab === 'Tab 9' && <Tab9 />}
        {activeTab === 'Tab 10' && <Tab10 />}
      </div>
    </div>
  );
}

export default App;

