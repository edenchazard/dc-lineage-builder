<template>
  <div class="tag-list">
    <button
      v-for="(tag, index) in tags"
      :key="tag.name"
      :class="tag.active ? 'tag-active' : 'tag-inactive'"
      type="button"
      @click="selected(index)"
    >
      {{ tag.name }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, PropType } from 'vue';
import { TagListOption } from '../../app/types';
import { deepClone } from '../../app/utils';
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
<style scoped>
.tag-list button {
  padding: 5px;
  color: #000;
  border-radius: 5px;
  border: 0px none;
  margin: 3px 6px;
}
.tag-active {
  background: lightblue;
}
.tag-inactive {
  background: lightgray;
  color: #000;
}
</style>
