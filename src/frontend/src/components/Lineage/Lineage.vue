<template>
<div class="lineage-container">
  <div
    class='lineage-view'
    :class="{
      'hideLabels': !config.showLabels,
      'hideEdit': !config.showInterface
    }">
    <LineageGenerationCounter :count="generations" />
    <ul class="lineage-root">
      <Dragon
        :data="root"
        :nodesFromRoot="0"
        :disabled="config.disabled" />
    </ul>
  </div>
</div>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { DragonType } from '../../app/types';
import { countGenerations } from '../../app/utils';

import Dragon from './Dragon.vue';
import LineageGenerationCounter from './LineageGenerationCounter.vue';

export default {
  name: 'Lineage',
  components: { Dragon, LineageGenerationCounter },
  props:{
    root: Object as PropType<DragonType>,
    config: Object
  },

  data() {
    return {    }
  },

  computed: {
    generations(){
      return countGenerations(this.root);
    }
  }
}
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