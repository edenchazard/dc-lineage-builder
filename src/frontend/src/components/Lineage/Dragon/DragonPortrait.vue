<template>
  <span
    :title="data.name"
    class="imgbox imgbox-fullsize"
    role="img"
  >
    <img
      v-if="data.metaData.src === 'dc'"
      :src="'//dragcave.net/image/' + data.image"
      :class="'fallback d-' + data.image"
    />
    <span
      v-else-if="data.metaData.src === 'local'"
      :class="'local d-' + data.image"
    ></span>
    <img
      v-else-if="data.metaData.src === 'ghost'"
      class="ghost"
      :src="data.image"
    />
    <img
      v-else
      src="/src/assets/images/placeholder.png"
    />
  </span>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { PortraitData } from '../../../app/types';

const props = defineProps({
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
@import url('../../../assets/tile-rendering/fallbacks.css');

/* apply the correct spritesheet depending on pixel ratio */
@import url('../../../assets/tile-rendering/sprites-36x48.css')
  (-webkit-min-device-pixel-ratio: 0),
  (-moz-min-device-pixel-ratio: 0), (-o-min-device-pixel-ratio: 0),
  (min-device-pixel-ratio: 0);

@import url('../../../assets/tile-rendering/sprites-72x96.css')
  (-webkit-min-device-pixel-ratio: 1.05),
  (-moz-min-device-pixel-ratio: 1.05), (-o-min-device-pixel-ratio: 21/20),
  (min-device-pixel-ratio: 1.05);
.ghost,
.local {
  width: var(--size36x48W);
  height: var(--size36x48H);
  background-size: cover;
}
.local {
  margin: -1px -1px;
  display: inline-block;
}

.imgbox {
  margin: 0px;
  border: var(--dragonPortraitStyle);
  overflow: hidden;
  display: inline-block;
  user-select: none;
}
.imgbox-fullsize {
  /* this needs adjusting by 2px in either directon */
  width: calc(var(--size36x48W) - 2px);
  height: calc(var(--size36x48H) - 2px);
}
.imgbox-twothirds {
  width: 24px;
  height: 32px;
}
.fallback {
  position: relative;
  image-rendering: -webkit-optimize-contrast;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
    supported by Chrome, Edge, Opera and Firefox */
  -webkit-touch-callout: none;
  pointer-events: none;
}
.ghost {
  margin: -1px -1px;
}
/* mods */
/* nocturne */
.d-OrTHo_day {
  top: -1px;
  left: 0px;
  height: 48px;
}
</style>
<style>
/* need a way of referencing these to the ones in the settings file */
:root {
  --size36x48W: 36px;
  --size36x48H: 48px;
  --size24x32W: 24px;
  --size24x32H: 32px;
}
</style>
