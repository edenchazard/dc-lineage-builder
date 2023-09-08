<template>
  <div class="text-box">
    <input
      v-if="type === 'input'"
      class="text interactive"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      @input="(e) => update((e.target as HTMLInputElement).value)"
    />
    <textarea
      v-else-if="type === 'textarea'"
      class="text interactive"
      v-bind="$attrs"
      :value="modelValue"
      @input="(e) => update((e.target as HTMLTextAreaElement).value)"
    >
    </textarea>
    <template v-if="showCopyButton">
      <button
        title="Copy text"
        class="copy pointer"
        :class="{
          success: tooltipState && showTooltip,
          fail: !tooltipState && showTooltip,
          visible: tooltipState,
        }"
        type="button"
        @click="copy"
      >
        <FontAwesomeIcon
          icon="copy"
          class="icon"
        />
      </button>
      <span
        v-if="showTooltip"
        class="tooltip"
        :class="{
          success: tooltipState && showTooltip,
          fail: !tooltipState && showTooltip,
          visible: tooltipState,
        }"
      >
        {{ tooltipState ? 'Copied!' : 'Error :(' }}
      </span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { PropType, computed, ref } from 'vue';
import { debounce } from '../../app/utils';

defineOptions({
  inheritAttrs: false,
});

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
    default: 2000,
  },
  showCopyButton: {
    type: Boolean,
    default: false,
  },
});
const timeout = computed(() => props.tooltipTimeout);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'copySuccess'): void;
  (e: 'copyFail'): void;
}>();

const tooltipState = ref<boolean>(false);
const showTooltip = ref<boolean>(false);

function update(newValue: string) {
  emit('update:modelValue', newValue);
}

const resetTooltip = debounce(() => {
  showTooltip.value = false;
  tooltipState.value = false;
}, timeout.value);

async function copy() {
  showTooltip.value = true;
  resetTooltip();
  try {
    await navigator.clipboard.writeText(props.modelValue);
    tooltipState.value = true;
    emit('copySuccess');
  } catch (ex) {
    tooltipState.value = false;
    emit('copyFail');
  }
}
</script>
<style scoped>
.text-box {
  position: relative;
}
.text {
  box-sizing: border-box;
  width: 100%;
  padding-right: 2.2rem;
  font-family: monospace;
}

.copy {
  position: absolute;
  right: 0.2rem;
  top: 0.2rem;
  border: 0 none;
  height: 1.5rem;
  width: 1.5rem;
  color: inherit;
  border-radius: 0.4rem;
  background: transparent;

  &.visible {
    color: #ffffff00;
  }

  &::before {
    content: '';
    position: absolute;
    transform: scale(0);
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.3s,
      color 0.32s 0.3s;
    background: white;
    color: #ffffff00;
  }

  &.success::before {
    content: '✔';
    transform: scale(1);
    color: var(--fg);
    background: var(--bg);
  }

  &.fail::before {
    content: '✖';
    transform: scale(1);
    color: var(--fg);
    background: var(--bg);
  }

  & .icon {
    margin: 0;
    padding: 0;
  }
}

.tooltip {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: -1em;
  background: var(--bg);
  color: var(--fg);
  padding: 0.5rem;
  border-radius: 0.4rem;
  opacity: 0;
  transition:
    margin-top 1.5s ease-in-out,
    opacity 1.5s ease-in-out;

  &::after {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-top: 0.5rem solid var(--bg);
    bottom: -0.5rem;
    right: 0.8rem;
  }

  &.visible {
    margin-top: -2em;
    opacity: 1;
  }

  > .icon {
    margin: 0;
    padding: 0;
  }
}

.success {
  --fg: #ffffffff;
  --bg: green;
}

.fail {
  --fg: #ffffffff;
  --bg: red;
}

@media (prefers-reduced-motion) {
  .tooltip {
    transition: none;
  }
}
</style>
