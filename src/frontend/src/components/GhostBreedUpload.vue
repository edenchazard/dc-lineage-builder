<template>
  <div class="breed-upload">
    <div
      v-if="dragon.image !== null"
      @click="fileInput?.click()"
    >
      <DragonPortrait
        class="tile-portrait disabled"
        :data="dragon"
      />
    </div>
    <input
      :id="label"
      ref="fileInput"
      type="file"
      accept="image/png, image/gif"
      @change="imageChanged"
    />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import GLOBALS from '../app/globals';
import settings from '../app/settings';
import { PortraitData } from '../app/types';
import DragonPortrait from '../components/DragonPortrait.vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'tileChosen', base64Data: string): void;
  (e: 'uploadError'): void;
}>();

const fileInput = ref<HTMLInputElement>();

// We have to use a "dummy" dragon to display the portrait
// unfortunately
const dragon = reactive<PortraitData>({
  // copy placeholder properties and replace what we need
  ...GLOBALS.placeholder,
  image: '/src/assets/images/placeholder.png',
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
        } else emit('uploadError');
      });

      reader.readAsDataURL(file);
    } else emit('uploadError');
  }
}
</script>
<style scoped>
input[type='file'] {
  display: none;
}
</style>
