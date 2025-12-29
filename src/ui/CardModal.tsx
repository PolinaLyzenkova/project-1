/**
 * Card Modal Component
 * 
 * Displays opportunity, market, and other cards in a modal dialog
 */

import React from 'react';
import { OpportunityCard, MarketCard, DoodadCard } from '../game/types';
import { formatCurrency } from '../game/data';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card?: OpportunityCard | MarketCard | DoodadCard;
  cardType?: 'opportunity' | 'market' | 'doodad';
  onBuy?: () => void;
  onPass?: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  card,
  cardType,
  onBuy,
  onPass
}) => {
  if (!isOpen || !card) return null;

  const renderOpportunityCard = (card: OpportunityCard) => (
    <div className="card-display">
      <div className="card-title">{card.name}</div>
      <div className="card-details">
        <div className="card-detail-row">
          <span>Type:</span>
          <span>{card.type === 'small_deal' ? 'Small Deal' : 'Big Deal'}</span>
        </div>
        <div className="card-detail-row">
          <span>Down Payment:</span>
          <span>{formatCurrency(card.downPayment)}</span>
        </div>
        <div className="card-detail-row">
          <span>Total Cost:</span>
          <span>{formatCurrency(card.totalCost)}</span>
        </div>
        <div className="card-detail-row">
          <span>Monthly Income:</span>
          <span className="stat-value positive">
            {formatCurrency(card.monthlyIncome)}
          </span>
        </div>
        <div className="card-detail-row">
          <span>Total Value:</span>
          <span>{formatCurrency(card.totalValue)}</span>
        </div>
        <p
          style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '2px solid var(--border-color)'
          }}
        >
          {card.description}
        </p>
      </div>
    </div>
  );

  const renderMarketCard = (card: MarketCard) => (
    <div className="card-display">
      <div className="card-title">{card.description}</div>
      <div className="card-details">
        <p>
          You can sell {card.assetName} for {formatCurrency(card.sellingPrice)}
        </p>
      </div>
    </div>
  );

  const renderDoodadCard = (card: DoodadCard) => (
    <div className="card-display">
      <div className="card-title">{card.name}</div>
      <div className="card-details">
        <div className="card-detail-row">
          <span>Cost:</span>
          <span className="stat-value negative">
            {formatCurrency(card.cost)}
          </span>
        </div>
        {card.expenseIncrease > 0 && (
          <div className="card-detail-row">
            <span>Monthly Expense Increase:</span>
            <span className="stat-value negative">
              {formatCurrency(card.expenseIncrease)}
            </span>
          </div>
        )}
        <p
          style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '2px solid var(--border-color)'
          }}
        >
          {card.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {cardType === 'opportunity'
              ? 'Opportunity Card'
              : cardType === 'market'
              ? 'Market Card'
              : 'Doodad Card'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div id="modal-body">
          {cardType === 'opportunity' && renderOpportunityCard(card as OpportunityCard)}
          {cardType === 'market' && renderMarketCard(card as MarketCard)}
          {cardType === 'doodad' && renderDoodadCard(card as DoodadCard)}
        </div>
        <div className="modal-actions">
          {cardType === 'opportunity' && (
            <>
              <button className="btn btn-success" onClick={onBuy}>
                Buy
              </button>
              <button className="btn btn-secondary" onClick={onPass || onClose}>
                Pass
              </button>
            </>
          )}
          {cardType !== 'opportunity' && (
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

