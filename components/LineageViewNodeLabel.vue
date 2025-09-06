<template>
  <textarea
    v-if="editing"
    ref="inputEl"
    class="label-block input"
    :class="classes"
    :placeholder="`Enter new ${display === 1 ? 'code' : 'name'}`"
    :value="value"
    spellcheck="false"
    rows="1"
    @focus="validate"
    @input="validate"
    @keydown.enter="finishedEditing"
    @blur="finishedEditing"
  />
  <div
    v-else
    class="label-block label"
    :class="classes"
    role="button"
    :tabindex="disabled ? -1 : 0"
    @keyup.space.enter="click"
    @click="click"
  >
    {{ display === 1 ? `(${value})` : value }}
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref, computed } from 'vue';
import { validateCode, validateName } from '~/utils/validation.js';
import { DragonBuilder } from '~/utils/dragonBuilder.js';

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
const classes = computed(() => [props.display === 1 ? 'code' : 'name']);

function validate() {
  const target = inputEl.value;
  if (!(target instanceof HTMLTextAreaElement)) return;

  const validator = props.display === 1 ? validateCode : validateName;
  const invalid = !validator(target.value);

  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';

  target.classList[invalid ? 'add' : 'remove']('bad');
}

async function click() {
  // don't act when disabled
  if (props.disabled) return;

  editing.value = true;

  // focus the input so users can type immediately
  await nextTick();
  inputEl.value?.focus?.();
}

function finishedEditing(e: Event) {
  let value = (e.target as HTMLTextAreaElement).value;

  // if a blank string is given, we'll generate a new name or code
  if (value === '')
    value =
      props.display === 1
        ? DragonBuilder.generateCode()
        : DragonBuilder.generateName();

  emit('changed', value);
  editing.value = false;
}
</script>

<style scoped>
.label-block {
  display: block;
  width: 120px;
  padding: 0;
  position: relative;
  top: -4px;
  height: auto;
}
.label {
  word-wrap: break-word;
  white-space: break-spaces;
}
.code {
  font-style: italic !important;
}
.input {
  /* we'd like to emulate the styles so most of these need
  to inherit */
  background: inherit;
  color: inherit;
  text-align: center;
  border: 0 none;
  box-shadow: none;
  margin: 0;
  padding: 0;
  font: inherit;
  height: auto;
  font-size: inherit !important;

  resize: none;

  /* prevents buggy textarea autosizing */
  overflow: hidden;

  /* helps prevent layout shifts */
  appearance: none;

  &.bad {
    background-color: var(
      --ui-builder-tile-label-invalid
    ); /*  rgb(255 193 7 / 10%); */
  }
}
</style>
