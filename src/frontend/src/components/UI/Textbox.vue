<template>
  <div>
    <input
      v-if="type === 'input'"
      class="text text-to-copy"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      @input="(e) => update((e.target as HTMLInputElement).value)"
    />
    <textarea
      v-else-if="type === 'textarea'"
      class="text text-to-copy"
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
        <font-awesome-icon icon="copy" />
        <span
          v-show="tooltip"
          :class="tooltip ? 'tooltip sliding-tooltip' : 'tooltip'"
          >
            <font-awesome-icon icon="check" />
          </span
        >
      </button>
      <span
          v-show="tooltip"
          :class="tooltip && 'tooltip-copy-success'"
        >
          {{ tooltip }}
        </span>
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
    default: 2000,
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
  width: 100%;
  position: relative;
}
.text {
  flex: 1;
  padding: 10px;
  padding-right: 35px;
  font-family: monospace;
}

span:has(.copy-button) {
  position: absolute;
  right: 7px;
  top: 7px;
}
.copy-button {
  border: 0 none;
  width: 25px;
  height: 25px;
  /* padding: 5px; */
  /* background: inherit; */
  /* color: var(--colourFG); */
  background: black;
  color: white;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  > svg {
    margin: 0;
    padding: 0;
  }
}
.tooltip {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  /* background: var(--colourFG);
  color: var(--colourBG); */
  background: crimson;
  color: white;
  width: 25px;
  height: 25px;
  right: 0;
  top: 0;
  /* border-radius: 5px; */
  > svg {
    margin: 0;
    padding: 0;
  }
}

@keyframes floatUp {
  0% {
    top: -30px;
    opacity: 0;
  }
  25% {
    top: -40px;
    opacity: 1;
  }
  75% {
    top: -40px;
    opacity: 1;
  }
  100% {
    top: -50px;
    opacity: 0;
  }
}

.tooltip-copy-success {
  position: absolute;
  top: -40px;
  right: 0;
  background-color: black;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  &::after {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    /* border-right: 5px solid transparent; */
    border-top: 8px solid black;
    bottom: -8px;
    right: 12px;
  }
  animation: floatUp 2s ease-in-out;
}


@keyframes slideUp {
  0% {
    top: 25px;
  }
  25% {
    top: 0;
  }
  75% {
    top: 0;
  }
  100% {
    top: -25px;
  }
}
.sliding-tooltip {
  animation: slideUp 2s ease-in-out;
}
.copy-button:hover {
  cursor: pointer;
}
/* .tooltip:after {
  content: '';
  display: block;
  position: absolute;
  top: 25px;
  left: 50%;
  margin-left: -10px;
  border-width: 10px;
  border-style: solid;
  border-color: var(--colourFG) transparent transparent transparent;
} */
</style>
