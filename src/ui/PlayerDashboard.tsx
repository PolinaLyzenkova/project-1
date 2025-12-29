/**
 * Player Dashboard Component
 * 
 * Displays a player's financial status and information
 */

import React from 'react';
import { Player } from '../game/types';
import { formatCurrency } from '../game/data';
import { recalculatePlayerFinances } from '../game/utils';

interface PlayerDashboardProps {
  player: Player;
  isActive: boolean;
}

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ player, isActive }) => {
  // Ensure finances are up to date
  React.useEffect(() => {
    recalculatePlayerFinances(player);
  }, [player]);

  return (
    <div className={`player-dashboard ${isActive ? 'active' : ''}`}>
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            className="player-token"
            style={{ background: player.color }}
          />
          <div>
            <h3>{player.name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {player.profession || 'No profession'}
            </p>
          </div>
        </div>
        {player.onFastTrack && (
          <span
            style={{
              background: 'var(--warning-color)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.85rem'
            }}
          >
            Fast Track
          </span>
        )}
      </div>

      <div className="financial-stats">
        <div className="stat-item">
          <span className="stat-label">Cash</span>
          <span className="stat-value">{formatCurrency(player.cash)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Monthly Income</span>
          <span className="stat-value">
            {formatCurrency(player.ratRace.monthlyIncome)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Monthly Expenses</span>
          <span className="stat-value negative">
            {formatCurrency(player.ratRace.totalExpenses)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Payday</span>
          <span
            className={`stat-value ${
              player.ratRace.monthlyPayday >= 0 ? 'positive' : 'negative'
            }`}
          >
            {formatCurrency(player.ratRace.monthlyPayday)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Passive Income</span>
          <span className="stat-value positive">
            {formatCurrency(player.ratRace.passiveIncome)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Net Worth</span>
          <span
            className={`stat-value ${
              player.netWorth >= 0 ? 'positive' : 'negative'
            }`}
          >
            {formatCurrency(player.netWorth)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Children</span>
          <span className="stat-value">{player.ratRace.children}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Position</span>
          <span className="stat-value">{player.position + 1}/20</span>
        </div>
      </div>
    </div>
  );
};

