import { describe, it, expect } from 'vitest';
import type { BreedEntry, DateString } from '../types';
import {
  filterBreedsByDate,
  type DateFilterConfig,
} from '../../store/useDateFilter.js';

function createMockedBreed(name: string, releaseDate?: DateString): BreedEntry {
  return {
    name,
    genderOnly: false,
    metaData: {
      tags: [],
      src: 'local',
    },
    releaseDate,
  };
}

const mockBreeds: BreedEntry[] = [
  createMockedBreed('Breed A', '2023-01-15'),
  createMockedBreed('Breed B', '2023-06-20'),
  createMockedBreed('Breed C', '2024-01-10'),
  createMockedBreed('Breed D', '2024-12-25'),
  createMockedBreed('Breed E'),
];

describe('Date Filter Functionality', () => {
  describe('filterBreedsByDate', () => {
    it('returns all breeds when no date filters are set', () => {
      const config: DateFilterConfig = { startDate: null, endDate: null };
      const result = filterBreedsByDate(mockBreeds, config);
      expect(result).toHaveLength(5);
      expect(result).toEqual(mockBreeds);
    });

    it('filters breeds by start date only (after date)', () => {
      const config: DateFilterConfig = {
        startDate: '2024-01-01',
        endDate: null,
      };
      const result = filterBreedsByDate(mockBreeds, config);

      expect(result).toHaveLength(3); // Breed C, Breed D, and Breed E (no date)
      expect(result.map((b) => b.name)).toEqual([
        'Breed C',
        'Breed D',
        'Breed E',
      ]);
    });

    it('filters breeds by end date only (before date)', () => {
      const config: DateFilterConfig = {
        startDate: null,
        endDate: '2023-12-31',
      };
      const result = filterBreedsByDate(mockBreeds, config);

      expect(result).toHaveLength(3); // Breed A, Breed B, and Breed E (no date)
      expect(result.map((b) => b.name)).toEqual([
        'Breed A',
        'Breed B',
        'Breed E',
      ]);
    });

    it('filters breeds by date range (between dates)', () => {
      const config: DateFilterConfig = {
        startDate: '2023-06-01',
        endDate: '2024-01-31',
      };
      const result = filterBreedsByDate(mockBreeds, config);

      expect(result).toHaveLength(3); // Breed B, Breed C, and Breed E (no date)
      expect(result.map((b) => b.name)).toEqual([
        'Breed B',
        'Breed C',
        'Breed E',
      ]);
    });

    it('includes breeds without release date for backward compatibility', () => {
      const config: DateFilterConfig = {
        startDate: '2025-01-01',
        endDate: null,
      };
      const result = filterBreedsByDate(mockBreeds, config);

      expect(result).toHaveLength(1); // Only Breed E (no date)
      expect(result[0].name).toBe('Breed E');
      expect(result[0].releaseDate).toBeUndefined();
    });

    it('handles exact date matches correctly', () => {
      const config: DateFilterConfig = {
        startDate: '2023-06-20',
        endDate: '2023-06-20',
      };
      const result = filterBreedsByDate(mockBreeds, config);

      expect(result).toHaveLength(2); // Breed B (exact match) and Breed E (no date)
      expect(result.map((b) => b.name)).toEqual(['Breed B', 'Breed E']);
    });

    it('returns breeds without dates when no breeds match the criteria', () => {
      const config: DateFilterConfig = {
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      };
      const result = filterBreedsByDate(mockBreeds, config);

      expect(result).toHaveLength(1); // Only Breed E (no date)
      expect(result[0].name).toBe('Breed E');
    });

    it('handles edge case: end date before start date', () => {
      const config: DateFilterConfig = {
        startDate: '2024-01-01',
        endDate: '2023-01-01',
      };
      const result = filterBreedsByDate(mockBreeds, config);

      // Should return only breeds without dates since no breed can be both after 2024-01-01 and before 2023-01-01
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Breed E');
    });

    it('handles date parsing correctly with time normalisation', () => {
      // Test that dates are treated as midnight (00:00:00) for consistent filtering
      const config: DateFilterConfig = {
        startDate: '2023-01-15',
        endDate: '2023-01-15',
      };
      const result = filterBreedsByDate(mockBreeds, config);

      expect(result).toHaveLength(2); // Breed A (exact match) and Breed E (no date)
      expect(result.map((b) => b.name)).toEqual(['Breed A', 'Breed E']);
    });
  });
});
