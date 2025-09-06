<template>
  <div
    class="text-box"
    :class="{ 'two-button': showCopyButton && showShareButton }"
  >
    <input
      v-if="type === 'input'"
      ref="input"
      class="text interactive"
      type="text"
      :="$attrs"
      :value="modelValue"
      @input="(e) => update((e.target as HTMLInputElement).value)"
      @focus="select"
    />
    <textarea
      v-else-if="type === 'textarea'"
      ref="input"
      class="text interactive"
      :value="modelValue"
      :="$attrs"
      @input="(e) => update((e.target as HTMLTextAreaElement).value)"
      @focus="select"
    >
    </textarea>
    <div class="buttons">
      <button
        v-if="showShareButton && shareIsSupported"
        :title="shareSettings.buttonTitle"
        class="button share pointer"
        type="button"
        @click="startShare"
      >
        <FontAwesomeIcon
          icon="share"
          class="icon"
        />
      </button>
      <template v-if="showCopyButton">
        <button
          :title="copyButtonTitle"
          class="button copy pointer"
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
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PropType } from 'vue';
import { useDebounceFn, useShare } from '@vueuse/core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineOptions({ inheritAttrs: false });

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'copySuccess'): void;
  (e: 'copyFail'): void;
}>();

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
  showShareButton: {
    type: Boolean,
    default: false,
  },
  shareParams: {
    type: Object as PropType<{
      title?: string;
      text?: string;
      buttonTitle?: string;
    }>,
    default: () => ({}),
  },
  copyButtonTitle: {
    type: String,
    default: 'Copy text',
  },
  selectAllOnFocus: {
    type: Boolean,
    default: false,
  },
});

const { share, isSupported: shareIsSupported } = useShare();
const tooltipState = ref<boolean>(false);
const showTooltip = ref<boolean>(false);
const input = ref<HTMLInputElement | HTMLTextAreaElement>();
const timeout = computed(() => props.tooltipTimeout);

// merge with defaults
const shareSettings = computed(() => ({
  title: '',
  text: '',
  buttonTitle: 'Share text',
  ...props.shareParams,
}));

function update(newValue: string) {
  emit('update:modelValue', newValue);
}

const resetTooltip = useDebounceFn(() => {
  showTooltip.value = false;
  tooltipState.value = false;
}, timeout.value);

async function copy() {
  showTooltip.value = true;
  await resetTooltip();
  try {
    await navigator.clipboard.writeText(props.modelValue);
    tooltipState.value = true;
    emit('copySuccess');
  } catch (_) {
    tooltipState.value = false;
    emit('copyFail');
  }
}

function startShare() {
  void share({
    title: shareSettings.value.title,
    text: shareSettings.value.text,
    url: props.modelValue,
  });
}

function select() {
  if (props.selectAllOnFocus && input.value) {
    input.value.setSelectionRange(0, input.value.value.length);
  }
}
</script>

<style scoped>
.text-box {
  position: relative;
  width: 100%;
  --scrollbar-space: 1.2rem;
  --gutter: 2rem;

  &.two-button {
    --gutter: 4rem;
  }
}

.text {
  width: 100%;
  box-sizing: border-box;
  padding-right: calc(var(--gutter) + var(--scrollbar-space));
  font-family: monospace;
  resize: vertical;
}

.buttons {
  position: absolute;
  right: var(--scrollbar-space);
  top: calc(var(--input-guttering) - 0.2rem);
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.button {
  border: 0 none;
  height: 1.5rem;
  width: 1.5rem;
  color: inherit;
  border-radius: 0.4rem;
  background: transparent;

  & .icon {
    margin: 0;
    padding: 0;
    color: var(--copy-icon);
  }
}
.copy {
  &.visible {
    color: #ffffff00;
  }

  &::before {
    content: '';
    position: absolute;
    transform: scale(0);
    height: 1.5rem;
    width: 1.5rem;
    top: 0;
    right: 0;
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
}

.tooltip {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  top: -1.5em;
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
  --fg: var(--copy-success-fg);
  --bg: var(--copy-success-bg);
}

.fail {
  --fg: var(--copy-fail-fg);
  --bg: var(--copy-fail-bg);
}

@media (prefers-reduced-motion) {
  .tooltip {
    transition: none;
  }
}
</style>
