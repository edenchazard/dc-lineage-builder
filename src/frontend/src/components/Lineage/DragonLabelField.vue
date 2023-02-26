<template>
  <span class="dragon-label">
    <label
      v-if="!editing"
      class="label"
    >
      <span
        v-if="display === 1"
        @click="clicked"
        class="code"
        >({{ value }})</span
      >
      <span
        v-else
        @click="clicked"
        class="name"
        >{{ value }}</span
      >
    </label>
    <span v-else>
      <input
        ref="inputel"
        :value="value"
        @keydown.enter="finishedEditing"
        @blur="finishedEditing"
        type="text"
        class="input"
        placeholder="label"
      />
    </span>
  </span>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { generateName, generateCode } from '../../app/dragonBuilder';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  display: {
    type: Number,
    required: true,
  },
  // determines whether click to edit is enabled
  disabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (e: 'changed', value: string): void;
}>();

const editing = ref(false);
const inputEl = ref<HTMLInputElement>();

function clicked() {
  if (props.disabled) return;

  editing.value = true;

  // focus the input so users can type immediately
  nextTick(() => inputEl.value && inputEl.value.focus());
}

function finishedEditing(e: Event) {
  let value = (e.target as HTMLInputElement).value;

  // if a blank string is given, we'll generate a new name or code
  if (value === '')
    value = props.display === 1 ? generateCode() : generateName();

  emit('changed', value);
  editing.value = false;
}
</script>

<style scoped>
.dragon-label {
  width: 120px;
}
.code {
  font-style: italic;
}
.label {
  display: block;
  word-wrap: break-word;
  position: relative;
  top: -4px;
  border-collapse: collapse;
  white-space: break-spaces;
}
.input {
  border: 1px dashed #44300b;
  text-align: center;
  width: 114px;
  font-family: var(--lineageFont);
  font-size: 14px;
}

.input:focus {
  border: 1px dashed #44300b;
  background: transparent;
  color: var(--colourFG);
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
  outline: none;
}
</style>
