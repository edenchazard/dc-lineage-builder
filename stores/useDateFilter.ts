import { useSessionStorage } from '@vueuse/core';
import type { BreedEntry, DateString, PortraitData } from '~/utils/shared/types';
import { computed } from 'vue';

export interface DateFilterConfig {
  startDate: DateString | null;
  endDate: DateString | null;
}

const defaultDateFilter: DateFilterConfig = {
  startDate: null,
  endDate: null,
};

export const dateFilterStore = useSessionStorage<DateFilterConfig>(
  'dateFilter',
  defaultDateFilter,
);

export function filterBreedsByDate<T extends PortraitData | BreedEntry>(
  breeds: T[],
  range: DateFilterConfig,
) {
  const { startDate, endDate } = range;

  // If both dates are empty, return all breeds
  if (!startDate && !endDate) {
    return breeds;
  }

  const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const end = endDate ? new Date(`${endDate}T00:00:00`) : null;

  return breeds.filter((breed) => {
    // Skip breeds without a release date
    if (!breed.releaseDate) {
      return true;
    }

    const releaseDate = new Date(`${breed.releaseDate}T00:00:00`);

    // If only startDate is provided, filter breeds released after startDate
    if (start && !end) {
      return releaseDate >= start;
    }

    // If only endDate is provided, filter breeds released before endDate
    if (!start && end) {
      return releaseDate <= end;
    }

    // If both dates are provided, filter breeds released between them
    if (start && end) {
      return releaseDate >= start && releaseDate <= end;
    }

    return true;
  });
}

export function clearDateFilter() {
  dateFilterStore.value = { ...defaultDateFilter };
}

export const hasActiveDateFilter = computed(
  () => !!(dateFilterStore.value.startDate || dateFilterStore.value.endDate),
);
