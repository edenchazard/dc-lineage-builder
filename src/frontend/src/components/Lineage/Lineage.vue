<template>
<div class="lineage-container">
  <div
    class='lineage-view'
    :class="{
      'hideLabels': !config.showLabels,
      'hideEdit': !config.showInterface
    }">
    <LineageGenerationCounter :count="generations" />
    <ul
      v-if="root !== null"
      class="lineage-root">
      <Dragon
        :data="root"
        :nodesFromRoot="0"
        :disabled="config.disabled" />
    </ul>
  </div>
</div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { LineageConfig, LineageRoot } from '../../app/types';
import { countGenerations } from '../../app/utils';

import Dragon from './Dragon.vue';
import LineageGenerationCounter from './LineageGenerationCounter.vue';

export default defineComponent({
  name: 'Lineage',
  components: { Dragon, LineageGenerationCounter },
  props:{
    root: {
      type: Object as PropType<LineageRoot> | null,
      required: true,
      default: null
    },
    config: {
      type: Object as PropType<LineageConfig>,
      required: false,
      default: {
        showLabels: true,
        showInterface: false,
        disabled: true
      }
    }
  },

  computed: {
    generations(){
      if(this.root === null) return 0;
      return countGenerations(this.root);
    }
  }
});
</script>

<style scoped>
.lineage-container{
  overflow:auto;
  margin: 0px 3px;
}
.lineage-view{
  margin:0px auto;
  font-family: var(--lineageFont);
  background:inherit;
  line-height: 19.6px;
  display: flex;
  flex-direction: column;
}
.lineage-root{
  padding: 1px;
  background:inherit;
  display: flex;
  margin:0px auto;
}
</style>