<template>
  <DragonPortrait
    ref="tile"
    class="pointer"
    v-bind="$attrs"
    :data="dragon"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    @click.prevent="openDialog"
    @keyup.space.enter="openDialog"
  />
  <input
    :id="label"
    ref="fileInput"
    class="file"
    type="file"
    accept="image/png, image/gif"
    tabindex="-1"
    @change="imageChanged"
  />
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { PortraitData } from '../shared/types';
import GLOBALS from '../shared/globals';
import settings from '../app/settings';
import DragonPortrait from './DragonPortrait.vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'tileChosen', base64Data: string): void;
  (e: 'uploadError', reasoning: string): void;
}>();

defineExpose({ focus });

const fileInput = ref<HTMLInputElement>();
const tile = ref<InstanceType<typeof DragonPortrait>>();

// We have to use a "dummy" dragon to display the portrait
// unfortunately
const dragon = reactive<PortraitData>({
  // copy placeholder properties and replace what we need
  ...GLOBALS.placeholder,
  image: new URL('/src/assets/images/placeholder.png', import.meta.url).href,
  metaData: {
    src: 'ghost',
    group: 'Standard',
    tags: ['Regular'],
  },
});

function imageChanged(e: Event) {
  const input = e.target as HTMLInputElement;

  if (input.files instanceof FileList && input.files[0]) {
    const file = input.files[0];

    if (file.size < settings.ghostBreedSize) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          const data = reader.result;
          dragon.image = data;
          emit('tileChosen', data);
        } else emit('uploadError', "File isn't string");
      });

      reader.readAsDataURL(file);
    } else emit('uploadError', 'Incorrect size');
  }
}

function openDialog() {
  if (props.disabled) return;
  if (fileInput.value === undefined) return;
  fileInput.value.click();
}

function focus() {
  if (props.disabled) return;
  tile.value?.$el.focus();
}
</script>
<style scoped>
.file {
  display: none;
}
</style>
../../../shared/types ../../../shared/globals
