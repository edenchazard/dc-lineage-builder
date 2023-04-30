<template>
  <button
    type="button"
    v-bind="$attrs"
    class="button"
    role="menuitem"
    tabindex="-1"
  >
    <slot></slot>
  </button>
</template>
<style scoped>
.button {
  border: none;
  display: block;
  width: 100%;
  background: inherit;
  color: inherit;
  text-align: left;
  padding: 10px;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.button:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
