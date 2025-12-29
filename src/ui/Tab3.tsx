/**
 * Tab 3 Component
 * 
 * Displays 10 text inputs with checkboxes next to each.
 * Uses localStorage to remember all values "forever"
 * (until the user clears browser storage).
 */

import React from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

interface TextCheckboxItem {
  id: number;
  text: string;
  checked: boolean;
}

export const IssueTracker: React.FC = () => {
  const [items, setItems] = usePersistentState<TextCheckboxItem[]>(
    'issue-tracker-text-checkbox-items',
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      text: 'test text',
      checked: false
    }))
  );

  const handleTextChange = (id: number, text: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked } : item
    ));
  };

  return (
    <div className="issue-tracker-container">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '30px' }}>
          Tab 3 - Text and Checkboxes
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {items.map((item) => (
            <div 
              key={item.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                padding: '15px',
                background: 'var(--bg-light)',
                borderRadius: '8px',
                border: '2px solid var(--border-color)'
              }}
            >
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                placeholder={`Text input ${item.id}`}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '2px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                }}
              />
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  accentColor: 'var(--primary-color)'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssueTracker;
