<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : null"
    v-bind="$attrs"
    class="menu-item"
    role="menuitem"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string;
  }>(),
  {
    as: 'button',
  },
);
</script>

<style scoped>
.menu-item {
  border: none;
  display: block;
  background: inherit;
  color: inherit;
  text-align: left;
  padding: 10px;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}
</style>
