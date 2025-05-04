import { expect, test } from '@jest/globals';
import app from '../app';

test('running test file', () => {
    expect(app).toBe(true);
});