<template>
  <FontAwesomeIcon icon="palette" />
  <label
    v-if="showLabel"
    :for="id"
    >Skin:</label
  >
  <select
    :id="id"
    v-model="skinStore.activeSkin"
    class="skin-switcher"
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
  background: black;
  color: #fff;
  border: 0px none;
}
</style>
