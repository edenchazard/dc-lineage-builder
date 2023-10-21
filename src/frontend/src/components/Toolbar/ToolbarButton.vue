<template>
  <button
    type="button"
    class="control"
    @click="emit('click')"
  >
    <font-awesome-icon
      v-bind="icon"
      class="icon"
    />
    <span
      v-if="label"
      class="label"
      >{{ label }}</span
    >
  </button>
</template>

<script setup lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome';
import type { PropType } from 'vue';

defineProps({
  icon: {
    type: Object as PropType<FontAwesomeIconProps>,
    default: () => ({
      icon: 'dragon',
    }),
  },
  label: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (e: 'click'): void;
  (e: 'optionSelected', option: { label: string; value: unknown }): void;
}>();
</script>

<style scoped>
.control {
  padding: 5px 0px 0px 0px;
  color: var(--builderControlBG);
  background: transparent;
  border: none;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0px 2px 2px var(--builderControlBG);
}
.control:enabled {
  cursor: pointer;
}
.control:enabled:hover {
  background: rgba(255, 255, 255, 0.3);
}
.control:disabled {
  opacity: 0.3;
}
.label {
  background: var(--builderControlBG);
  color: var(--builderControlFG);
  display: block;
  width: 100%;
  border-radius: 0px 0px 5px 5px;
  padding: 5px;
  box-sizing: border-box;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.option {
  padding: 5px;
}
.icon {
  margin-bottom: 8px;
  display: block;
  padding: 0px;
}
</style>
