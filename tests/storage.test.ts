/**
 * Storage Layer Tests
 * 
 * This test file contains unit tests for the localStorage module.
 * It tests all CRUD (Create, Read, Update, Delete) operations
 * and edge cases.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveUserData,
  getAllUserData,
  deleteUserData,
  clearAllUserData,
  getUserDataById,
  UserData,
} from '../src/storage/localStorage';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LocalStorage Module', () => {
  // Clear storage before each test to ensure isolation
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveUserData', () => {
    it('should save a new user data entry', () => {
      const userData: UserData = {
        id: 'test-id-1',
        name: 'John Doe',
        email: 'john@example.com',
        timestamp: Date.now(),
      };

      const result = saveUserData(userData);
      expect(result).toBe(true);

      const allData = getAllUserData();
      expect(allData).toHaveLength(1);
      expect(allData[0]).toEqual(userData);
    });

    it('should save multiple entries', () => {
      const userData1: UserData = {
        id: 'test-id-1',
        name: 'John Doe',
        email: 'john@example.com',
        timestamp: Date.now(),
      };

      const userData2: UserData = {
        id: 'test-id-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        timestamp: Date.now(),
      };

      saveUserData(userData1);
      saveUserData(userData2);

      const allData = getAllUserData();
      expect(allData).toHaveLength(2);
    });
  });

  describe('getAllUserData', () => {
    it('should return empty array when no data exists', () => {
      const data = getAllUserData();
      expect(data).toEqual([]);
    });

    it('should return all stored user data', () => {
      const userData1: UserData = {
        id: 'test-id-1',
        name: 'John Doe',
        email: 'john@example.com',
        timestamp: Date.now(),
      };

      const userData2: UserData = {
        id: 'test-id-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        timestamp: Date.now(),
      };

      saveUserData(userData1);
      saveUserData(userData2);

      const allData = getAllUserData();
      expect(allData).toHaveLength(2);
      expect(allData).toContainEqual(userData1);
      expect(allData).toContainEqual(userData2);
    });
  });

  describe('deleteUserData', () => {
    it('should delete a specific entry by ID', () => {
      const userData1: UserData = {
        id: 'test-id-1',
        name: 'John Doe',
        email: 'john@example.com',
        timestamp: Date.now(),
      };

      const userData2: UserData = {
        id: 'test-id-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        timestamp: Date.now(),
      };

      saveUserData(userData1);
      saveUserData(userData2);

      const result = deleteUserData('test-id-1');
      expect(result).toBe(true);

      const allData = getAllUserData();
      expect(allData).toHaveLength(1);
      expect(allData[0].id).toBe('test-id-2');
    });

    it('should return true even if ID does not exist', () => {
      const result = deleteUserData('non-existent-id');
      expect(result).toBe(true);
    });
  });

  describe('clearAllUserData', () => {
    it('should clear all stored data', () => {
      const userData: UserData = {
        id: 'test-id-1',
        name: 'John Doe',
        email: 'john@example.com',
        timestamp: Date.now(),
      };

      saveUserData(userData);
      expect(getAllUserData()).toHaveLength(1);

      const result = clearAllUserData();
      expect(result).toBe(true);
      expect(getAllUserData()).toHaveLength(0);
    });
  });

  describe('getUserDataById', () => {
    it('should return the correct entry by ID', () => {
      const userData: UserData = {
        id: 'test-id-1',
        name: 'John Doe',
        email: 'john@example.com',
        timestamp: Date.now(),
      };

      saveUserData(userData);

      const found = getUserDataById('test-id-1');
      expect(found).toEqual(userData);
    });

    it('should return undefined for non-existent ID', () => {
      const found = getUserDataById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });
});

