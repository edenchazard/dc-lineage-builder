<template>
  <select
    :id="id"
    v-model="model"
    class="skin-switcher pointer interactive"
    v-bind="$attrs"
  >
    <option
      v-for="(readableName, skinId) in availableSkins"
      :key="skinId"
      :value="skinId"
    >
      {{ readableName }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { availableSkins, type SkinId } from '../composables/useUserSettings';

withDefaults(
  defineProps<{
    id: string;
  }>(),
  {
    id: '',
  },
);

const model = defineModel<SkinId>({
  type: String,
  default: '',
});
</script>
