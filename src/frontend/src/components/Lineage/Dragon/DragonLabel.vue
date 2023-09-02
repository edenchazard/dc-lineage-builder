<template>
  <div
    :class="[
      'dragon-label',
      display === 1 ? 'code' : 'name',
      { invalid: warnInvalid && !editing },
    ]"
    :title="warnInvalid ? 'Warning: Label does not meet DC requirements' : ''"
    tabindex="0"
    @focus="click"
    @click="click"
  >
    <input
      v-if="editing"
      ref="inputEl"
      class="input"
      type="text"
      placeholder="enter label"
      :pattern="
        (display === 1 ? CODEREGEXP : NAMEREGEXP).toString().slice(2, -2)
      "
      :title="`enter new ${display === 1 ? 'code' : 'name'}`"
      :value="value"
      spellcheck="false"
      @keydown.enter="finishedEditing"
      @blur="finishedEditing"
    />
    <label
      v-else
      class="label"
    >
      {{ value }}
    </label>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import {
  validateCode,
  validateName,
  CODEREGEXP,
  NAMEREGEXP,
} from '../../../app/validators';
import { DragonBuilder } from '../../../app/dragon';

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

function validate() {
  const validator = props.display === 1 ? validateCode : validateName;
  return !validator(props.value);
}

const warnInvalid = computed(validate);

function click() {
  // don't act when disabled
  if (props.disabled) return;

  editing.value = true;

  // focus the input so users can type immediately
  nextTick(() => inputEl.value && inputEl.value.focus());
}

function finishedEditing(e: Event) {
  let value = (e.target as HTMLInputElement).value;

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
.dragon-label {
  width: 120px;
  padding: 0px;
  position: relative;
  top: -4px;
}
.label {
  word-wrap: break-word;
  white-space: break-spaces;
}
.code .label,
.code .input {
  font-style: italic;
}
.code .label::before {
  content: '(';
}
.code .label::after {
  content: ')';
}
.input {
  /* we'd like to emulate the styles so most of these need
  to inherit */
  background: inherit;
  font-family: inherit;
  color: inherit;
  text-align: center;
  border: 0px none;
  box-shadow: none;
  margin: 0px;
  padding: 0px;
  /* it just needs to be a little smaller to prevent layout shifts */
  font-size: inherit;
  width: 100%;
  outline: 1px dashed #44300b;
  outline-style: dashed;
  outline-color: #44300b;
}
.input,
.invalid {
  outline-width: 1px;
  outline-offset: 1px;
}
.input:invalid,
.invalid {
  outline-style: solid;
  outline-color: red;
}
</style>
