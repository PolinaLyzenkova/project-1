/**
 * Data Display Component
 * 
 * This component displays all stored user data entries in a list format.
 * It shows each entry's name, email, and timestamp, and provides
 * functionality to delete individual entries.
 */

import React from 'react';
import { UserData } from '../storage/localStorage';

// Props interface for the DataDisplay component
interface DataDisplayProps {
  data: UserData[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

/**
 * DataDisplay Component
 * Renders a list of all stored user data entries
 */
export const DataDisplay: React.FC<DataDisplayProps> = ({ data, onDelete, onRefresh }) => {
  /**
   * Formats a timestamp (milliseconds since epoch) into a readable date string
   * @param timestamp - The timestamp to format
   * @returns Formatted date string
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  /**
   * Handles deletion of a specific entry
   * @param id - The ID of the entry to delete
   */
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      onDelete(id);
      // Refresh the display after deletion
      setTimeout(onRefresh, 100);
    }
  };

  return (
    <div className="data-display-container">
      <div className="data-display-header">
        <h2>Stored Entries ({data.length})</h2>
        <button onClick={onRefresh} className="refresh-button">
          Refresh
        </button>
      </div>

      {data.length === 0 ? (
        <div className="empty-message">
          No entries yet. Add some data using the form above!
        </div>
      ) : (
        <div className="data-list">
          {data.map((entry) => (
            <div key={entry.id} className="data-entry">
              <div className="entry-content">
                <div className="entry-field">
                  <strong>Name:</strong> {entry.name}
                </div>
                <div className="entry-field">
                  <strong>Email:</strong> {entry.email}
                </div>
                <div className="entry-field">
                  <strong>Added:</strong> {formatDate(entry.timestamp)}
                </div>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="delete-button"
                aria-label={`Delete entry for ${entry.name}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

