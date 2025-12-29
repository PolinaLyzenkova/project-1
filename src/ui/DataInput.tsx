/**
 * Data Input Component
 * 
 * This component provides a form interface for users to input
 * their data (name and email). It handles form validation and
 * submission.
 */

import React, { useState } from 'react';

// Props interface for the DataInput component
interface DataInputProps {
  onSubmit: (name: string, email: string) => void;
}

/**
 * DataInput Component
 * Renders a form for user data input with validation
 */
export const DataInput: React.FC<DataInputProps> = ({ onSubmit }) => {
  // State to manage form input values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  /**
   * Validates email format using a simple regex pattern
   * @param email - The email string to validate
   * @returns true if email format is valid, false otherwise
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handles form submission
   * Validates inputs and calls the onSubmit callback if valid
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate name is not empty
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    // Validate email format
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // If validation passes, submit the data
    onSubmit(name.trim(), email.trim());
    
    // Clear form after successful submission
    setName('');
    setEmail('');
  };

  return (
    <div className="data-input-container">
      <h2>Add New Entry</h2>
      <form onSubmit={handleSubmit} className="data-input-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="form-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-button">
          Add Entry
        </button>
      </form>
    </div>
  );
};

