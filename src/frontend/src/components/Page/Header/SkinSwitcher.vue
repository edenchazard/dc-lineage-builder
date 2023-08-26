<template>
  <div>
    <FontAwesomeIcon
      icon="palette"
      class="margin"
    />
    <label
      v-if="showLabel"
      :for="id"
      class="margin"
      >Skin:</label
    >
    <select
      :id="id"
      v-model="skinStore.activeSkin"
      class="skin-switcher pointer interactive"
      title="Skin"
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
import { useSkinStore } from '../../../store/skin';
const skinStore = useSkinStore();

defineProps({
  showLabel: {
    type: Boolean,
    default: true,
  },
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
  background: inherit;
  color: inherit;
}
</style>
