import { describe, expect, it } from '@jest/globals';
import app from '../app';

describe('test', () => {
    it('should be true', () => {
        expect(app).toBe(true);
    });
});