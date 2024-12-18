<template>
  <label
    v-for="tag in tagSet"
    :key="tag"
    class="tag"
    :class="{
      inactive: !model[tag],
    }"
    v-bind="$attrs"
  >
    <input
      class="sr-only"
      :name="name"
      type="checkbox"
      :checked="model[tag]"
      :value="tag"
      @change="selected(tag)"
    />{{ tag }}</label
  >
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import { deepClone } from '../shared/utils.js';
import type { FilterTag, NewTag, TagModel } from '../shared/types.js';

const props = withDefaults(
  defineProps<{
    defaultActive: boolean;
    atLeastOneEnabled: boolean;
    name: string;
    tagSet: Array<NewTag>;
  }>(),
  {
    atLeastOneEnabled: false,
    defaultActive: true,
  },
);

const model = defineModel<TagModel>('modelValue', {
  default: {},
});

function selected(tag: NewTag) {
  // if this option is enabled, then we must ensure at least one tag
  // from the set is enabled at all times,
  // to do this, we simply check the array of tags for actives and not
  // matching the selected tag name
  /* if (props.atLeastOneEnabled) {
    if (!props.modelValue)) return;
  } */

  model.value[tag] = !model.value[tag];
}
</script>

<style scoped lang="postcss">
.tag {
  display: inline-block;
  padding: 0.3rem;
  border-radius: 0.5rem;
  border: 0px none;
  font-size: 0.7rem;
  cursor: pointer;
  opacity: 1;

  &.inactive {
    opacity: 0.4;
  }

  &:focus-within {
    outline: 3px solid var(--ui-focus-colour);
  }

  > [type='checkbox'] {
    padding: 0;
    margin: 0;
    appearance: none;
    outline: none;
  }
}
</style>
