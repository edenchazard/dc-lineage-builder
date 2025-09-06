<template>
  <div class="date-filter">
    <div class="date-filter-header">
      <h3>Release Date Filter</h3>
      <button
        v-if="hasActiveDateFilter()"
        type="button"
        class="clear-dates"
        title="Clear date filter"
        @click="clearDateFilter"
      >
        Clear
      </button>
    </div>
    <div class="date-inputs">
      <div class="date-input-group">
        <label for="start-date">From</label>
        <input
          id="start-date"
          v-model="dateFilterStore.startDate"
          type="date"
          class="date-input"
          placeholder="Start date"
        />
      </div>
      <div class="date-input-group">
        <label for="end-date">To</label>
        <input
          id="end-date"
          v-model="dateFilterStore.endDate"
          type="date"
          class="date-input"
          placeholder="End date"
        />
      </div>
    </div>
    <div class="date-filter-help">
      <p>
        Leave start date empty to filter breeds released before the end date.
        Leave end date empty to filter breeds released after the start date.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  dateFilterStore,
  clearDateFilter,
  hasActiveDateFilter,
} from '../store/useDateFilter';
</script>

<style scoped>
.date-filter {
  padding: 0.5rem;
  border: 1px solid var(--ui-border-color, #ccc);
  border-radius: 0.25rem;
  background: var(--ui-modal-content, #fff);
}

.date-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.date-filter-header h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.clear-dates {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  text-transform: uppercase;
}

.clear-dates:hover {
  background: #c82333;
}

.date-inputs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.date-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-input-group label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--ui-text-colour, #333);
}

.date-input {
  padding: 0.5rem;
  border: 1px solid var(--ui-border-color, #ccc);
  border-radius: 0.25rem;
  font-size: 0.85rem;
  width: 100%;
}

.date-input:focus {
  outline: none;
  border-color: var(--ui-accent-color, #007bff);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.date-filter-help {
  font-size: 0.75rem;
  color: var(--ui-text-muted, #666);
  line-height: 1.3;
}

.date-filter-help p {
  margin: 0;
}
</style>