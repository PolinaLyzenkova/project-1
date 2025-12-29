/**
 * Local Storage Module
 * 
 * This module provides a simple interface for storing and retrieving data
 * in the browser's localStorage. It handles serialization/deserialization
 * of data and provides type-safe operations.
 */

// Define the data structure for user entries
export interface UserData {
  id: string;
  name: string;
  email: string;
  timestamp: number;
}

// Storage key used in localStorage
const STORAGE_KEY = 'user_data_storage';

/**
 * Save user data to localStorage
 * @param data - The user data object to save
 * @returns true if successful, false otherwise
 */
export function saveUserData(data: UserData): boolean {
  try {
    // Retrieve existing data
    const existingData = getAllUserData();
    
    // Add new entry
    existingData.push(data);
    
    // Save back to localStorage as JSON string
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
}

/**
 * Retrieve all user data from localStorage
 * @returns Array of all stored user data entries
 */
export function getAllUserData(): UserData[] {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    // If no data exists, return empty array
    if (!storedData) {
      return [];
    }
    
    // Parse JSON string back to array
    return JSON.parse(storedData) as UserData[];
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return [];
  }
}

/**
 * Delete a specific user data entry by ID
 * @param id - The ID of the entry to delete
 * @returns true if successful, false otherwise
 */
export function deleteUserData(id: string): boolean {
  try {
    const allData = getAllUserData();
    const filteredData = allData.filter(item => item.id !== id);
    
    // Save updated array back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return true;
  } catch (error) {
    console.error('Error deleting user data:', error);
    return false;
  }
}

/**
 * Clear all user data from localStorage
 * @returns true if successful, false otherwise
 */
export function clearAllUserData(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
}

/**
 * Get a specific user data entry by ID
 * @param id - The ID of the entry to retrieve
 * @returns The user data entry or undefined if not found
 */
export function getUserDataById(id: string): UserData | undefined {
  const allData = getAllUserData();
  return allData.find(item => item.id === id);
}

