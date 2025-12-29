/**
 * Test Setup File
 * 
 * This file configures the test environment before tests run.
 * It sets up any global mocks or configurations needed for testing.
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

