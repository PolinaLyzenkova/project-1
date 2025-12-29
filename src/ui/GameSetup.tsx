/**
 * Game Setup Component
 * 
 * Handles player creation and game initialization
 */

import React, { useState } from 'react';
import { Player, ProfessionCard } from '../game/types';
import { PLAYER_COLORS, generateId } from '../game/data';

interface GameSetupProps {
  onStartGame: (players: Player[], professions: ProfessionCard[]) => void;
  hasSavedGame?: boolean;
  onResumeGame?: () => void;
  onNewGame?: () => void;
}

export const GameSetup: React.FC<GameSetupProps> = ({ 
  onStartGame, 
  hasSavedGame = false,
  onResumeGame,
  onNewGame 
}) => {
  const [players, setPlayers] = useState<Omit<Player, 'profession'>[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0]);
  const [availableColors, setAvailableColors] = useState([...PLAYER_COLORS]);

  const addPlayer = () => {
    const name = playerName.trim();
    
    if (!name) {
      alert('Please enter a player name');
      return;
    }

    if (players.length >= 6) {
      alert('Maximum 6 players allowed');
      return;
    }

    if (!availableColors.includes(selectedColor)) {
      alert('This color is already taken');
      return;
    }

    const newPlayer: Omit<Player, 'profession'> = {
      id: generateId(),
      name,
      color: selectedColor,
      position: 0,
      onFastTrack: false,
      ratRace: {
        monthlyIncome: 0,
        monthlyExpenses: 0,
        monthlyPayday: 0,
        passiveIncome: 0,
        totalExpenses: 0,
        children: 0,
        creditLimit: 0,
        auditorId: null,
        assets: {
          realEstate: [],
          stocks: [],
          businesses: [],
          cash: 0
        },
        liabilities: {
          homeLoan: 0,
          carLoan: 0,
          creditCardDebt: 0,
          bankLoans: []
        }
      },
      fastTrack: {
        buyout: 0,
        incomeGoal: 0,
        currentIncome: 0,
        businesses: [],
        dreamPrice: 0,
        dreamPriceMultiplier: 1
      },
      cash: 0,
      netWorth: 0,
      status: 'active',
      hasCharityBonus: false,
      rolledDice: [],
      passesThisTurn: 0
    };

    setPlayers([...players, newPlayer]);
    const newAvailableColors = availableColors.filter(c => c !== selectedColor);
    setAvailableColors(newAvailableColors);
    
    if (newAvailableColors.length > 0) {
      setSelectedColor(newAvailableColors[0]);
    }
    
    setPlayerName('');
  };

  const removePlayer = (index: number) => {
    const player = players[index];
    setAvailableColors([...availableColors, player.color]);
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (players.length < 1) {
      alert('Please add at least 1 player');
      return;
    }

    // Convert to full Player objects (professions will be assigned in GameScreen)
    const fullPlayers = players.map(p => ({ ...p, profession: null })) as Player[];
    onStartGame(fullPlayers, []);
  };

  return (
    <div className="game-setup">
      <h1>💰 Cashflow Game</h1>
      <p style={{ marginBottom: '30px', color: '#64748b' }}>
        A financial education board game
      </p>

      {hasSavedGame && (
        <div className="setup-section" style={{ 
          background: '#eff6ff', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '30px',
          border: '2px solid var(--primary-color)'
        }}>
          <h2 style={{ marginBottom: '10px' }}>Continue Previous Game?</h2>
          <p style={{ marginBottom: '15px', color: '#64748b' }}>
            You have a saved game in progress. Would you like to resume?
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {onResumeGame && (
              <button className="btn btn-primary" onClick={onResumeGame}>
                Resume Game
              </button>
            )}
            {onNewGame && (
              <button className="btn btn-secondary" onClick={onNewGame}>
                Start New Game
              </button>
            )}
          </div>
        </div>
      )}

      <div className="setup-section">
        <h2>1. Add Players</h2>
        
        {players.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Players Added:</h3>
            {players.map((player, index) => (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: player.color,
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <span style={{ fontWeight: 600 }}>{player.name}</span>
                <button
                  onClick={() => removePlayer(index)}
                  className="btn btn-danger"
                  style={{
                    marginLeft: 'auto',
                    padding: '5px 10px',
                    fontSize: '0.85rem'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="player-name">Player Name:</label>
          <input
            type="text"
            id="player-name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            placeholder="Enter player name"
          />
        </div>

        <div className="form-group">
          <label>Choose Color:</label>
          <div className="color-picker">
            {PLAYER_COLORS.map((color) => (
              <div
                key={color}
                className={`color-option ${selectedColor === color ? 'selected' : ''} ${!availableColors.includes(color) ? 'disabled' : ''}`}
                style={{
                  background: color,
                  opacity: availableColors.includes(color) ? 1 : 0.3,
                  cursor: availableColors.includes(color) ? 'pointer' : 'not-allowed'
                }}
                onClick={() => {
                  if (availableColors.includes(color)) {
                    setSelectedColor(color);
                  }
                }}
              />
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={addPlayer}>
          Add Player
        </button>
      </div>

      <div className="setup-section">
        <button
          className="btn btn-success"
          onClick={handleStartGame}
          disabled={players.length < 1}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

