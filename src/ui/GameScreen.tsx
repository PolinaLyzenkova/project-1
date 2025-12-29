/**
 * Game Screen Component
 * 
 * Main game interface with board, dashboards, and game controls
 */

import React, { useState, useEffect } from 'react';
import { Player, BoardSpace, OpportunityCard, MarketCard, DoodadCard, ProfessionCard } from '../game/types';
import { GameBoard } from './GameBoard';
import { PlayerDashboard } from './PlayerDashboard';
import { CardModal } from './CardModal';
import {
  RAT_RACE_BOARD,
  OPPORTUNITY_CARDS,
  MARKET_CARDS,
  DOODAD_CARDS,
  PROFESSION_CARDS,
  shuffleArray,
  formatCurrency,
  randomInt
} from '../game/data';
import {
  movePlayerOnBoard,
  recalculatePlayerFinances,
  checkRatRaceExit
} from '../game/utils';
import { saveGameState, loadGameState } from '../storage/gameState';
import { 
  createCustomModeProfession, 
  applyCustomModePassiveIncome
} from '../game/customMode';

interface GameScreenProps {
  players: Player[];
  professions: ProfessionCard[];
  onGameEnd?: (winner: Player) => void;
  onPlayersChange?: (players: Player[]) => void;
  onGamePhaseChange?: (phase: 'rat_race' | 'fast_track' | 'ended') => void;
  customMode?: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({ 
  players: initialPlayers, 
  professions, 
  onGameEnd,
  onPlayersChange,
  onGamePhaseChange,
  customMode = false
}) => {
  const [players, setPlayersState] = useState<Player[]>(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [boardSpaces] = useState<BoardSpace[]>(RAT_RACE_BOARD);
  const [opportunityDeck, setOpportunityDeck] = useState<OpportunityCard[]>(shuffleArray([...OPPORTUNITY_CARDS]));
  const [marketDeck, setMarketDeck] = useState<MarketCard[]>(shuffleArray([...MARKET_CARDS]));
  const [doodadDeck, setDoodadDeck] = useState<DoodadCard[]>(shuffleArray([...DOODAD_CARDS]));
  const [currentCard, setCurrentCard] = useState<OpportunityCard | MarketCard | DoodadCard | null>(null);
  const [cardType, setCardType] = useState<'opportunity' | 'market' | 'doodad' | null>(null);
  const [gameLog, setGameLog] = useState<string[]>(['Game started. Good luck!']);
  
  // Refs to prevent infinite loops
  const hasLoadedStateRef = React.useRef(false);
  const shouldSaveRef = React.useRef(false);
  const isLoadingRef = React.useRef(false);

  // Helper to save game state
  const saveCurrentGameState = React.useCallback((updatedPlayers: Player[], playerIndex: number) => {
    if (!shouldSaveRef.current) return; // Don't save during initial load
    
    if (onPlayersChange) {
      onPlayersChange(updatedPlayers);
    }
    
    saveGameState({
      players: updatedPlayers,
      currentPlayerIndex: playerIndex,
      gamePhase: updatedPlayers.some(p => p.onFastTrack) ? 'fast_track' : 'rat_race',
      professionDeck: professions
    });
  }, [professions, onPlayersChange]);

  // Wrapper to update players and notify parent/save state
  const updatePlayers = React.useCallback((newPlayers: Player[] | ((prev: Player[]) => Player[]), shouldSave: boolean = true) => {
    setPlayersState(prevPlayers => {
      const updatedPlayers = typeof newPlayers === 'function' ? newPlayers(prevPlayers) : newPlayers;
      
      // Save state if we should (and after initial load)
      if (shouldSave && shouldSaveRef.current && !isLoadingRef.current) {
        // Save asynchronously to avoid blocking
        setTimeout(() => {
          saveCurrentGameState(updatedPlayers, currentPlayerIndex);
        }, 0);
      }
      
      return updatedPlayers;
    });
  }, [currentPlayerIndex, saveCurrentGameState]);

  // Load saved game state once on mount
  useEffect(() => {
    // Don't load if already loaded or currently loading
    if (hasLoadedStateRef.current || isLoadingRef.current) return;
    
    // Don't load if players are already initialized
    if (initialPlayers.length > 0 && initialPlayers.every(p => p.profession)) {
      hasLoadedStateRef.current = true;
      shouldSaveRef.current = true;
      return;
    }
    
    isLoadingRef.current = true; // Set flag immediately to prevent re-entry

    const savedState = loadGameState();
    if (savedState && savedState.players && savedState.players.length > 0) {
      // Check if players are already initialized (have professions)
      const needsInitialization = savedState.players.some(p => !p.profession);
      
      if (!needsInitialization) {
        // Restore saved state
        shouldSaveRef.current = false; // Prevent saving during load
        
        // Clear dice for all players when restoring (allows current player to roll)
        const restoredPlayers = savedState.players.map(p => ({
          ...p,
          rolledDice: []
        }));
        
        setPlayersState(restoredPlayers);
        if (savedState.currentPlayerIndex !== undefined) {
          setCurrentPlayerIndex(savedState.currentPlayerIndex);
        }
        
        // Only add log message if it doesn't already exist
        setGameLog(prev => {
          const hasRestoreMessage = prev.some(log => log.includes('Game state restored'));
          if (!hasRestoreMessage) {
            const currentPlayerName = restoredPlayers[savedState.currentPlayerIndex || 0]?.name || 'Player';
            return [
              `[${new Date().toLocaleTimeString()}] Game state restored from saved data.`,
              `[${new Date().toLocaleTimeString()}] It's ${currentPlayerName}'s turn.`,
              ...prev.slice(0, 48)
            ]; // Limit log size
          }
          return prev;
        });
        
        // Notify parent
        if (onPlayersChange) {
          onPlayersChange(restoredPlayers);
        }
        
        hasLoadedStateRef.current = true;
        // Enable saving after a short delay
        setTimeout(() => {
          shouldSaveRef.current = true;
          isLoadingRef.current = false;
        }, 100);
        return;
      }
    }
    
    // Initialize players with professions if needed
    if (initialPlayers.length > 0 && initialPlayers.some(p => !p.profession)) {
      shouldSaveRef.current = false; // Prevent saving during initialization
      const shuffledProfessions = shuffleArray([...PROFESSION_CARDS]);
      const updatedPlayers = initialPlayers.map((player, index) => {
        if (!player.profession) {
          let profession = shuffledProfessions[index % shuffledProfessions.length];
          
          // Apply custom mode modifications if enabled
          if (customMode) {
            profession = createCustomModeProfession(profession);
          }
          
          const updatedPlayer = { ...player };
          updatedPlayer.profession = profession.name;
          updatedPlayer.ratRace.monthlyIncome = profession.paycheck;
          updatedPlayer.ratRace.monthlyExpenses = profession.expenses;
          updatedPlayer.ratRace.monthlyPayday = profession.cashFlow;
          updatedPlayer.ratRace.creditLimit = profession.creditLimit;
          updatedPlayer.cash = profession.assets.cash;
          updatedPlayer.ratRace.liabilities.homeLoan = profession.liabilities.homeMortgage;
          updatedPlayer.ratRace.liabilities.carLoan = profession.liabilities.carLoan;
          updatedPlayer.ratRace.liabilities.creditCardDebt = profession.liabilities.creditCard;
          
          // Set auditor (right neighbor)
          const auditorIndex = (index + 1) % initialPlayers.length;
          updatedPlayer.ratRace.auditorId = initialPlayers[auditorIndex].id;
          
          recalculatePlayerFinances(updatedPlayer);
          return updatedPlayer;
        }
        return player;
      });
      
      setPlayersState(updatedPlayers);
      setGameLog(prev => [`[${new Date().toLocaleTimeString()}] Game started with ${updatedPlayers.length} player(s)!`, ...prev]);
      hasLoadedStateRef.current = true;
      
      // Enable saving after initialization
      setTimeout(() => {
        shouldSaveRef.current = true;
        isLoadingRef.current = false;
        if (onPlayersChange) {
          onPlayersChange(updatedPlayers);
        }
      }, 100);
    } else {
      hasLoadedStateRef.current = true;
      shouldSaveRef.current = true;
      isLoadingRef.current = false;
    }
  }, []); // Only run once on mount

  // Save game state when currentPlayerIndex changes (but not during initial load)
  useEffect(() => {
    if (!shouldSaveRef.current || isLoadingRef.current || players.length === 0) return;

    saveCurrentGameState(players, currentPlayerIndex);
  }, [currentPlayerIndex, saveCurrentGameState]); // Only save when player turn changes

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setGameLog(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const currentPlayer = players[currentPlayerIndex];

  const rollDice = () => {
    if (!currentPlayer) return;

    // Check if player already rolled this turn
    if (currentPlayer.rolledDice && currentPlayer.rolledDice.length > 0) {
      addLog(`${currentPlayer.name} already rolled this turn. Please pass turn.`);
      return;
    }

    if (currentPlayer.passesThisTurn > 0) {
      currentPlayer.passesThisTurn--;
      addLog(`${currentPlayer.name} is skipping this turn (${currentPlayer.passesThisTurn} remaining)`);
      nextTurn();
      return;
    }

    let diceCount = currentPlayer.onFastTrack ? 2 : 1;
    if (currentPlayer.hasCharityBonus) {
      diceCount = 3; // Can choose from 3 dice
      currentPlayer.hasCharityBonus = false;
    }

    const rolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(randomInt(1, 6));
    }

    currentPlayer.rolledDice = rolls;
    const total = rolls.reduce((sum, roll) => sum + roll, 0);

    addLog(`${currentPlayer.name} rolled: ${rolls.join(', ')} = ${total}`);

    movePlayer(currentPlayer, total);
    updatePlayers([...players]);
  };

  const movePlayer = (player: Player, totalRoll: number) => {
    movePlayerOnBoard(player, totalRoll);

    // Check if passed or landed on Payday
    if (player.position === 0 && totalRoll > 0 && !player.onFastTrack) {
      collectPayday(player);
    }

    const space = boardSpaces[player.position];
    executeSpaceAction(player, space);
    
    addLog(`${player.name} moved to position ${player.position + 1}: ${space.name}`);
  };

  const executeSpaceAction = (player: Player, space: BoardSpace) => {
    switch (space.type) {
      case 'payday':
        collectPayday(player);
        break;
      case 'opportunity':
        showOpportunityCard();
        break;
      case 'market':
        showMarketCard();
        break;
      case 'doodads':
        showDoodadCard();
        break;
      case 'baby':
        addChild(player);
        break;
      case 'downsize':
        player.passesThisTurn = 2;
        addLog(`${player.name} must skip 2 turns due to downsizing.`);
        updatePlayers([...players]);
        break;
      case 'charity':
        showCharityDialog(player);
        break;
      case 'exit':
        if (checkRatRaceExit(player)) {
          moveToFastTrack(player);
        } else {
          addLog(`${player.name} needs more passive income to exit Rat Race.`);
        }
        break;
    }
  };

  const collectPayday = (player: Player) => {
    const amount = player.ratRace.monthlyPayday;
    player.cash += amount;
    recalculatePlayerFinances(player);
    addLog(`${player.name} collected ${formatCurrency(amount)} payday!`);
    updatePlayers([...players]);
  };

  const showOpportunityCard = () => {
    if (opportunityDeck.length === 0) {
      setOpportunityDeck(shuffleArray([...OPPORTUNITY_CARDS]));
    }
    const deck = [...opportunityDeck];
    const card = deck.pop()!;
    setOpportunityDeck(deck);
    setCurrentCard(card);
    setCardType('opportunity');
  };

  const showMarketCard = () => {
    if (marketDeck.length === 0) {
      setMarketDeck(shuffleArray([...MARKET_CARDS]));
    }
    const deck = [...marketDeck];
    const card = deck.pop()!;
    setMarketDeck(deck);
    setCurrentCard(card);
    setCardType('market');
  };

  const showDoodadCard = () => {
    if (doodadDeck.length === 0) {
      setDoodadDeck(shuffleArray([...DOODAD_CARDS]));
    }
    const deck = [...doodadDeck];
    const card = deck.pop()!;
    setDoodadDeck(deck);
    handleDoodad(card);
  };

  const handleDoodad = (card: DoodadCard) => {
    const player = currentPlayer;
    if (!player) return;

    if (player.cash < card.cost) {
      alert(`${player.name} doesn't have enough cash! Need a loan.`);
      // TODO: Implement loan dialog
      return;
    }

    player.cash -= card.cost;
    if (card.expenseIncrease > 0) {
      player.ratRace.monthlyExpenses += card.expenseIncrease;
      recalculatePlayerFinances(player);
    }
    addLog(`${player.name} paid ${formatCurrency(card.cost)} for ${card.name}`);
    updatePlayers([...players]);
  };

  const purchaseOpportunity = () => {
    if (!currentPlayer || !currentCard || cardType !== 'opportunity') return;

    const opportunity = currentCard as OpportunityCard;
    if (currentPlayer.cash < opportunity.downPayment) {
      alert('Insufficient funds!');
      return;
    }

    currentPlayer.cash -= opportunity.downPayment;
    // Apply custom mode passive income multiplier if enabled
    const monthlyIncome = customMode 
      ? applyCustomModePassiveIncome(opportunity.monthlyIncome)
      : opportunity.monthlyIncome;
    
    currentPlayer.ratRace.assets.realEstate.push({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: opportunity.name,
      downPayment: opportunity.downPayment,
      totalCost: opportunity.totalCost,
      monthlyIncome: monthlyIncome,
      currentValue: opportunity.totalValue
    });

    recalculatePlayerFinances(currentPlayer);
    addLog(`${currentPlayer.name} purchased ${opportunity.name} for ${formatCurrency(opportunity.downPayment)}`);
    
    updatePlayers([...players]);
    closeModal();
  };

  const addChild = (player: Player) => {
    if (player.ratRace.children >= 3) {
      alert('Maximum 3 children allowed');
      return;
    }

    player.ratRace.children += 1;
    recalculatePlayerFinances(player);
    addLog(`${player.name} had a baby! Monthly expenses increase by $40.`);
    updatePlayers([...players]);
  };

  const showCharityDialog = (player: Player) => {
    const donation = Math.floor(player.ratRace.monthlyIncome * 0.10);

    if (confirm(`${player.name}: Donate ${formatCurrency(donation)} to charity? You'll be able to roll 3 dice on your next turn.`)) {
      if (player.cash < donation) {
        alert('Insufficient funds for charity donation');
        return;
      }
      player.cash -= donation;
      player.hasCharityBonus = true;
      recalculatePlayerFinances(player);
      addLog(`${player.name} donated ${formatCurrency(donation)} to charity!`);
      updatePlayers([...players]);
    }
  };

  const moveToFastTrack = (player: Player) => {
    player.onFastTrack = true;
    player.position = 0;
    addLog(`🎉 ${player.name} escaped the Rat Race and entered the Fast Track!`);
    updatePlayers([...players]);
    // TODO: Implement Fast Track mechanics
  };

  // TODO: Wire game end / phase change callbacks into win condition logic.
  // These references keep the props "used" so TypeScript doesn't error,
  // until full win-state handling is implemented.
  useEffect(() => {
    void onGameEnd;
    void onGamePhaseChange;
  }, []);

  const nextTurn = () => {
    const player = currentPlayer;
    if (!player) return;
    
    // Check for Rat Race exit at start of turn
    if (!player.onFastTrack && checkRatRaceExit(player)) {
      moveToFastTrack(player);
    }

    // Check win condition
    // TODO: Implement win condition checking

    // Calculate next player index first
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
    // Update players array - clear current player's dice and prepare next player
    const updatedPlayers = players.map((p, idx) => {
      if (idx === nextPlayerIndex) {
        return { ...p, rolledDice: [] }; // Clear dice for next player
      }
      return p;
    });
    
    // Update to next player BEFORE updating players array
    setCurrentPlayerIndex(nextPlayerIndex);
    
    // Update players state
    updatePlayers(updatedPlayers);
    
    const nextPlayer = updatedPlayers[nextPlayerIndex];
    addLog(`It's ${nextPlayer.name}'s turn.`);
  };

  const passTurn = () => {
    nextTurn();
  };

  const closeModal = () => {
    setCurrentCard(null);
    setCardType(null);
  };

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="current-player-info">
          <div
            className="player-token"
            style={{ background: currentPlayer?.color || '#ccc' }}
          />
          <div>
            <h2>{currentPlayer?.name || 'No Player'}</h2>
            <p>
              {currentPlayer?.onFastTrack ? 'On Fast Track' : 'In Rat Race'}
            </p>
          </div>
        </div>
        <div className="game-actions">
          <button 
            className="btn btn-primary" 
            onClick={rollDice}
            disabled={currentPlayer?.rolledDice && currentPlayer.rolledDice.length > 0}
          >
            {currentPlayer?.rolledDice && currentPlayer.rolledDice.length > 0 
              ? `Rolled: ${currentPlayer.rolledDice.join(', ')}` 
              : 'Roll Dice'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={passTurn}
            disabled={!currentPlayer?.rolledDice || currentPlayer.rolledDice.length === 0}
          >
            Pass Turn
          </button>
        </div>
      </div>

      <div className="game-main-content">
        <div className="board-section">
          <GameBoard boardSpaces={boardSpaces} players={players} />
        </div>
        
        <div className="game-sidebar">
          <div className="dashboard-container">
            {players.map((player, index) => (
              <PlayerDashboard
                key={player.id}
                player={player}
                isActive={index === currentPlayerIndex}
              />
            ))}
          </div>
          
          <div className="game-log">
            {gameLog.map((entry, index) => (
              <div key={index} className="log-entry">
                {entry}
              </div>
            ))}
          </div>
        </div>
      </div>

      {currentCard && cardType && (
        <CardModal
          isOpen={!!currentCard}
          onClose={closeModal}
          card={currentCard}
          cardType={cardType}
          onBuy={cardType === 'opportunity' ? purchaseOpportunity : undefined}
          onPass={closeModal}
        />
      )}
    </div>
  );
};

