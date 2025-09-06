<template>
  <div class="group">
    <div class="buttons">
      <slot></slot>
    </div>
    <span
      v-if="$slots.legend"
      class="legend"
      ><slot name="legend"></slot
    ></span>
  </div>
</template>

<style scoped>
.group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  scroll-snap-align: start;
}
.legend {
  align-self: stretch;
  background: var(--ui-builder-toolbar-selection-group-bg);
  color: var(--ui-builder-toolbar-selection-group-fg);
  text-align: center;
  border-radius: 0 0 0.25rem 0.25rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 0.8em;
}
.buttons {
  display: flex;
  align-items: center;
  flex: 1;
}
</style>
