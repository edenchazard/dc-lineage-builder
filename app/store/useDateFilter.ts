import { useSessionStorage } from '@vueuse/core';
import type { BreedEntry } from '../shared/types';

export interface DateFilterConfig {
  startDate: string;
  endDate: string;
}

export const dateFilterStore = useSessionStorage<DateFilterConfig>('dateFilter', {
  startDate: '',
  endDate: '',
});

export function filterBreedsByDate<T extends Pick<BreedEntry, 'releaseDate'>>(
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

export function clearDateFilter() {
  dateFilterStore.value = {
    startDate: '',
    endDate: '',
  };
}

export function hasActiveDateFilter(): boolean {
  return !!(dateFilterStore.value.startDate || dateFilterStore.value.endDate);
}