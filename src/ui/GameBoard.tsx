/**
 * Game Board Component
 * 
 * Renders the circular game board with spaces and player tokens
 */

import React from 'react';
import { BoardSpace, Player } from '../game/types';

interface GameBoardProps {
  boardSpaces: BoardSpace[];
  players: Player[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ boardSpaces, players }) => {
  const renderBoardSpaces = () => {
    return boardSpaces.map((space, index) => {
      // Calculate position in circle using percentages
      const totalSpaces = boardSpaces.length;
      const angle = (index * (2 * Math.PI) / totalSpaces) - (Math.PI / 2); // Start at top
      
      // Use percentage-based positioning for responsiveness
      const radiusPercent = 40; // 40% from center
      const centerPercent = 50; // Center of circle
      
      const xPercent = centerPercent + (radiusPercent * Math.cos(angle));
      const yPercent = centerPercent + (radiusPercent * Math.sin(angle));

      // Find players on this space
      const playersOnSpace = players.filter(
        p => p.position === space.position && !p.onFastTrack
      );

      return (
        <div
          key={space.id}
          className={`board-space ${space.type}`}
          style={{
            position: 'absolute',
            left: `${xPercent}%`,
            top: `${yPercent}%`,
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '60px'
          }}
          title={space.name}
        >
          <div style={{ fontSize: '0.7rem', textAlign: 'center' }}>{space.name}</div>
          {playersOnSpace.map((player) => (
            <div
              key={player.id}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: player.color,
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
          ))}
        </div>
      );
    });
  };

  return (
    <div className="board-container">
      {renderBoardSpaces()}
    </div>
  );
};

