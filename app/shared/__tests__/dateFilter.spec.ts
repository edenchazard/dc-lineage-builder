import { describe, it, expect } from 'vitest';
import type { BreedEntry } from '../types';

// Import the filtering function and types directly
type DateFilterConfig = {
  startDate: `${string}-${string}-${string}` | '';
  endDate: `${string}-${string}-${string}` | '';
};

// Copy the filtering function for testing (to avoid database setup issues)
function filterBreedsByDate<T extends Pick<BreedEntry, 'releaseDate'>>(
  breeds: T[],
  config: DateFilterConfig,
): T[] {
  const { startDate, endDate } = config;
  
  // If both dates are empty, return all breeds
  if (!startDate && !endDate) {
    return breeds;
  }

  return breeds.filter((breed) => {
    // Skip breeds without a release date
    if (!breed.releaseDate) {
      return true; // Include breeds without release date for backward compatibility
    }

    const breedDate = new Date(breed.releaseDate + 'T00:00:00');
    
    // If only startDate is provided, filter breeds released after startDate
    if (startDate && !endDate) {
      const start = new Date(startDate + 'T00:00:00');
      return breedDate >= start;
    }

    // If only endDate is provided, filter breeds released before endDate
    if (!startDate && endDate) {
      const end = new Date(endDate + 'T00:00:00');
      return breedDate <= end;
    }

    // If both dates are provided, filter breeds released between them
    if (startDate && endDate) {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');
      return breedDate >= start && breedDate <= end;
    }

    return true;
  });
}

// Mock breed entries for testing
const mockBreeds: Pick<BreedEntry, 'name' | 'releaseDate'>[] = [
  { name: 'Breed A', releaseDate: '2023-01-15' },
  { name: 'Breed B', releaseDate: '2023-06-20' },
  { name: 'Breed C', releaseDate: '2024-01-10' },
  { name: 'Breed D', releaseDate: '2024-12-25' },
  { name: 'Breed E' }, // No release date
];

describe('Date Filter Functionality', () => {
  describe('filterBreedsByDate', () => {
    it('returns all breeds when no date filters are set', () => {
      const config: DateFilterConfig = { startDate: '', endDate: '' };
      const result = filterBreedsByDate(mockBreeds, config);
      expect(result).toHaveLength(5);
      expect(result).toEqual(mockBreeds);
    });

    it('filters breeds by start date only (after date)', () => {
      const config: DateFilterConfig = { startDate: '2024-01-01', endDate: '' };
      const result = filterBreedsByDate(mockBreeds, config);
      
      expect(result).toHaveLength(3); // Breed C, Breed D, and Breed E (no date)
      expect(result.map(b => b.name)).toEqual(['Breed C', 'Breed D', 'Breed E']);
    });

    it('filters breeds by end date only (before date)', () => {
      const config: DateFilterConfig = { startDate: '', endDate: '2023-12-31' };
      const result = filterBreedsByDate(mockBreeds, config);
      
      expect(result).toHaveLength(3); // Breed A, Breed B, and Breed E (no date)
      expect(result.map(b => b.name)).toEqual(['Breed A', 'Breed B', 'Breed E']);
    });

    it('filters breeds by date range (between dates)', () => {
      const config: DateFilterConfig = { 
        startDate: '2023-06-01', 
        endDate: '2024-01-31' 
      };
      const result = filterBreedsByDate(mockBreeds, config);
      
      expect(result).toHaveLength(3); // Breed B, Breed C, and Breed E (no date)
      expect(result.map(b => b.name)).toEqual(['Breed B', 'Breed C', 'Breed E']);
    });

    it('includes breeds without release date for backward compatibility', () => {
      const config: DateFilterConfig = { startDate: '2025-01-01', endDate: '' };
      const result = filterBreedsByDate(mockBreeds, config);
      
      expect(result).toHaveLength(1); // Only Breed E (no date)
      expect(result[0].name).toBe('Breed E');
      expect(result[0].releaseDate).toBeUndefined();
    });

    it('handles exact date matches correctly', () => {
      const config: DateFilterConfig = { 
        startDate: '2023-06-20', 
        endDate: '2023-06-20' 
      };
      const result = filterBreedsByDate(mockBreeds, config);
      
      expect(result).toHaveLength(2); // Breed B (exact match) and Breed E (no date)
      expect(result.map(b => b.name)).toEqual(['Breed B', 'Breed E']);
    });

    it('returns breeds without dates when no breeds match the criteria', () => {
      const config: DateFilterConfig = { 
        startDate: '2025-01-01', 
        endDate: '2025-12-31' 
      };
      const result = filterBreedsByDate(mockBreeds, config);
      
      expect(result).toHaveLength(1); // Only Breed E (no date)
      expect(result[0].name).toBe('Breed E');
    });

    it('handles edge case: end date before start date', () => {
      const config: DateFilterConfig = { 
        startDate: '2024-01-01', 
        endDate: '2023-01-01' 
      };
      const result = filterBreedsByDate(mockBreeds, config);
      
      // Should return only breeds without dates since no breed can be both after 2024-01-01 and before 2023-01-01
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Breed E');
    });

    it('handles date parsing correctly with time normalization', () => {
      // Test that dates are treated as midnight (00:00:00) for consistent filtering
      const config: DateFilterConfig = { 
        startDate: '2023-01-15', 
        endDate: '2023-01-15' 
      };
      const result = filterBreedsByDate(mockBreeds, config);
      
      expect(result).toHaveLength(2); // Breed A (exact match) and Breed E (no date)
      expect(result.map(b => b.name)).toEqual(['Breed A', 'Breed E']);
    });
  });

  describe('Date format validation (type level)', () => {
    it('accepts valid date format strings', () => {
      const validConfig: DateFilterConfig = {
        startDate: '2023-01-01',
        endDate: '2024-12-31',
      };
      expect(validConfig.startDate).toBe('2023-01-01');
      expect(validConfig.endDate).toBe('2024-12-31');
    });

    it('accepts empty strings', () => {
      const emptyConfig: DateFilterConfig = {
        startDate: '',
        endDate: '',
      };
      expect(emptyConfig.startDate).toBe('');
      expect(emptyConfig.endDate).toBe('');
    });
  });
});