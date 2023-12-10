<template>
  <div>
    <FontAwesomeIcon
      icon="palette"
      class="margin"
    />
    <label
      :for="id"
      class="margin"
      >Skin:</label
    >
    <select
      :id="id"
      v-model="skinStore.activeSkin"
      class="skin-switcher pointer interactive"
      v-bind="$attrs"
    >
      <option
        v-for="skin in skinStore.availableSkins"
        :key="skin.cssName"
        :value="skin.cssName"
      >
        {{ skin.prettyName }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useSkinStore } from '../store/useSkinStore';
const skinStore = useSkinStore();

defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>
<style scoped>
.margin {
  margin-right: 0.5rem;
}
.skin-switcher {
  background: var(--ui-footer-bg);
  color: var(--ui-footer-fg);
  border: 1px solid var(--ui-footer-fg);
}
</style>
