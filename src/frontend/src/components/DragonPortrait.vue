<template>
    <span
        :title="data.name"
        class="imgbox imgbox-fullsize"
        @click="$emit('click')">
        <img
            v-if="data.image.x !== undefined"
            :src="data.image.link"
            :style="{
                left: data.image.x+'px',
                top: data.image.y+'px', 
                height: (data.image.h == '' ? 'initial' : data.image.h+'px')
            }"
            class='fallback' />
        <span v-else-if="data.metaData.ghost === false" class='local' :class="'d-'+data.image" />
        <img v-else-if="data.metaData.ghost === true" class='ghost' :src="data.image" />
    </span>
</template>
<script>
export default {
    name: 'DragonPortrait',
    props: {
        data: Object,
        gen: Number
    }/*,
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
};
</script>
<style scoped>
/* apply the correct spritesheet depending on pixel ratio */
@import url("../assets/sprites-36x48.css")
    (-webkit-min-device-pixel-ratio: 0),
    (-moz-min-device-pixel-ratio: 0),
    (-o-min-device-pixel-ratio: 0),
    (min-device-pixel-ratio: 0);

@import url("../assets/sprites-72x96.css")
    (-webkit-min-device-pixel-ratio: 1.05),
    (-moz-min-device-pixel-ratio: 1.05),
    (-o-min-device-pixel-ratio: 21/20),
    (min-device-pixel-ratio: 1.05);

.local{
    width: 36px;
    height: 48px;
    margin:-1px -1px;
    display: inline-block;
    background-size: cover;
    image-rendering: -webkit-optimize-contrast;
}

.imgbox {
    margin: 0px;
    border: var(--dragonPortraitStyle);
    overflow: hidden;
    display: inline-block;
}
.imgbox-fullsize{
    width: 34px;
    height: 46px;
}
.imgbox-twothirds{
    width: 24px;
    height: 32px;
}
.fallback{
    position: relative;
    image-rendering:-webkit-optimize-contrast;
}
.ghost{
    margin:-1px -1px;
}
</style>