import { test, expect } from '@playwright/test';

test.describe('Sanity Check', () => {
  test('should assert true is true without a running server', async () => {
    expect(true).toBe(true);
  });
});
