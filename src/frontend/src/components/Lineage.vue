<template>
  <div
    class='lineage-view'
    :class="{
      'hideLabels': !config.showLabels,
      'hideEdit': !config.showInterface
    }">
    <LineageGenerationCounter :count="generations" />
    <ul class="lineage-root">
      <Dragon
        v-bind.sync="tree" 
        :nodesFromRoot="0"
        :disabled="config.disabled" />
    </ul>
  </div>
</template>
<script>
import Dragon from '@/components/Dragon';
import LineageGenerationCounter from '@/components/LineageGenerationCounter';
import { utils } from '@/app/bundle';

export default {
  name: 'Lineage',
  components: { Dragon, LineageGenerationCounter },
  props:{
    tree: Object,
    config: Object
  },

  data() {
    return {    }
  },

  computed: {
    generations(){
      return utils.countGenerations(this.tree);
    }
  }
}
</script>

<style scoped>
.lineage-view{
  margin:0px auto;
  font-family: var(--lineageFont);
  padding: 1px;
  background:inherit;
  line-height: 19.6px;
  overflow-x:auto;
  display: table;
}
.lineage-root{
  padding: 1px;
  background:inherit;
}
</style>