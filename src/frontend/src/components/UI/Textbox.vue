<template>
  <div>
    <input
      v-if="type === 'input'"
      class="text"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      @input="(e) => update((e.target as HTMLInputElement).value)"
    />
    <textarea
      v-else-if="type === 'textarea'"
      class="text"
      v-bind="$attrs"
      :value="modelValue"
      @input="(e) => update((e.target as HTMLTextAreaElement).value)"
    >
    </textarea>
    <span v-if="showCopyButton">
      <button
        class="copy-button"
        type="button"
        @click="copy"
      >
        <font-awesome-icon icon="copy" /> Copy
        <span
          v-show="tooltip"
          class="tooltip"
          >{{ tooltip }}</span
        >
      </button>
    </span>
  </div>
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    default: '',
  },
  type: {
    type: String as PropType<'input' | 'textarea'>,
    default: 'input',
  },
  tooltipTimeout: {
    type: Number,
    default: 1000,
  },
  showCopyButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'copySuccess'): void;
  (e: 'copyFail'): void;
}>();

const tooltip = ref<null | string>(null);

function update(newValue: string) {
  emit('update:modelValue', newValue);
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.modelValue);
    tooltip.value = 'Copied!';
    emit('copySuccess');
  } catch (ex) {
    tooltip.value = 'Error copying';
    emit('copyFail');
  }

  setTimeout(() => (tooltip.value = null), props.tooltipTimeout);
}
</script>
<style scoped>
div {
  display: flex;
  border-radius: 5px;
  align-items: center;
}
.text {
  flex: 1;
}
.copy-button {
  border: 0px none;
  background: inherit;
  color: var(--colourFG);
  position: relative;
}
.tooltip {
  display: block;
  position: absolute;
  background: var(--colourFG);
  color: var(--colourBG);
  padding: 5px;
  right: 0px;
  top: -39px;
}
.copy-button:hover {
  cursor: pointer;
}
.tooltip:after {
  content: '';
  display: block;
  position: absolute;
  top: 25px;
  left: 50%;
  margin-left: -10px;
  border-width: 10px;
  border-style: solid;
  border-color: var(--colourFG) transparent transparent transparent;
}
</style>
