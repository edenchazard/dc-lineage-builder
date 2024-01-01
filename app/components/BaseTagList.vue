<template>
  <label
    v-for="(tag, index) in tags"
    :key="tag.name"
    class="tag"
    :class="{
      inactive: !tag.active,
    }"
    v-bind="$attrs"
  >
    <input
      class="sr-only"
      :name="name"
      type="checkbox"
      :checked="tag.active"
      :value="tag.name"
      @change="selected(index)"
    />{{ tag.name }}</label
  >
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import type { TagListOption } from '../shared/types';
import { deepClone } from '../shared/utils.js';

const props = defineProps({
  // Accepts a mixed array of { name, active }
  // or simple strings. If a string is provided,
  // the tag will be transformed into the tag object
  // with the default value applied
  modelValue: {
    type: Array as PropType<Array<string | TagListOption>>,
    required: true,
  },
  defaultActive: {
    type: Boolean,
    default: true,
  },
  atLeastOneEnabled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', values: TagListOption[]): void;
}>();

// create our tag states based on values provided in initial
const tags = ref<TagListOption[]>(
  props.modelValue.map((tag) =>
    typeof tag === 'string'
      ? // if string, transform into { name, active } object
        { name: tag, active: props.defaultActive }
      : // or return the tag as provided
        tag,
  ),
);

function selected(index: number) {
  const tag = tags.value[index];

  // if this option is enabled, then we must ensure at least one tag
  // is enabled at all times,
  // to do this, we simply check the array of tags for actives and not
  // matching the selected tag name
  if (props.atLeastOneEnabled) {
    const cb = ({ active, name }: TagListOption) => active && name !== tag.name;
    if (!tags.value.some(cb)) return;
  }

  tags.value[index].active = !tag.active;
  emit('update:modelValue', deepClone(tags.value));
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
