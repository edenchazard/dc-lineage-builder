<template>
  <span
    :title="data.name"
    class="imgbox imgbox-fullsize"
  >
    <img
      v-if="data.metaData.src === 'dc'"
      :src="'https://dragcave.net/image/' + data.image"
      :class="'fallback d-' + data.image"
    />
    <span
      v-else-if="data.metaData.src === 'local'"
      :class="'local d-' + data.image"
      role="img"
    />
    <img
      v-else-if="data.metaData.src === 'ghost'"
      class="ghost"
      :src="data.image"
    />
    <img
      v-else
      src="../assets/images/placeholder.png"
    />
    <span class="sr-only label">{{ data.name }}</span>
  </span>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { PortraitData } from '../shared/types';

defineProps({
  data: {
    type: Object as PropType<PortraitData>,
    required: true,
  },
  gen: {
    type: Number,
    required: false,
    default: 1,
  },
});
/*,
computed:{
    // determines whether to provide a full size image or a small image
    calculated: function(){
        let real = { };
        if(this.gen > 3){
            const initial = this.data.image;
            if(initial.x != 0){
                real.x = initial.x - (initial.x / 3);
            }
            else{
                real.x = 0;
            }
            if(initial.h > 32){
                real.h = initial.h - (initial.h / 3)
            }
            else{
                real.h = initial.h;
            }
            real.w = 24;
            return real;
        }
        else{
            return { ...this.data.image, w: 34};
        }
    }
}*/
</script>
<style scoped>
/* add css for fallbacks */
@import url('../assets/tile-rendering/fallbacks.css');

.ghost,
.local,
.fallback {
  pointer-events: none;
  user-select: none;
  -webkit-touch-callout: none; /* iOS Safari */
}
.ghost,
.local {
  width: var(--size36x48W);
  height: var(--size36x48H);
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
}
.local {
  margin: -1px -1px;
  display: inline-block;
}

.imgbox {
  border: 1px solid var(--dc-lineage-line-colour);
  background: var(--dc-lineage-tile-background, transparent);
  overflow: hidden;
  display: block;
}
.imgbox-fullsize {
  /* this needs adjusting by 2px in either directon */
  width: var(--size36x48-w-adjust);
  height: var(--size36x48-h-adjust);
  contain: layout size paint;
}
.imgbox-twothirds {
  width: 24px;
  height: 32px;
}
.fallback {
  position: relative;
  image-rendering: -webkit-optimize-contrast;
}
.ghost {
  margin: -1px -1px;
}
.label {
  user-select: text;
}
/* mods */
/* nocturne */
.d-OrTHo_day {
  top: -1px;
  left: 0px;
  height: 48px;
}
</style>
