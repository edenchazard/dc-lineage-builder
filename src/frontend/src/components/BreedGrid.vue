<template>
<VirtualCollection
    v-if="compact && list.length > 0"
    class="mates-compact"
    :cellSizeAndPositionGetter="cellSizeAndPositionGetter"
    :collection="list"
    :height="height"
    :width="width"
    :sectionSize="size">
    <DragonPortrait
        v-if="props.data"
        slot="cell"
        slot-scope="props"
        :data="props.data"
        @click="$emit('selected', props.data)" />
</VirtualCollection>
<ul
    v-else
    class="mates-list">
    <li
        v-for="breed in list"
        :key="breed.data.name"
        @click="$emit('selected', breed.data)">
        <DragonPortrait
            :data="breed.data" />
            {{breed.data.name}}
    </li>
</ul>
</template>

<script>
import DragonPortrait from "./DragonPortrait.vue";

const obs = {
    func: null,
    observer: null
}

export default {
    name: 'BreedGrid',
    components: {
        DragonPortrait,
    },
    props: {
        compact: Boolean,
        list: {
            default: () => [],
            type: Array
        },
        size: {
            default: 600,
            type: Number
        }
    },
    mounted(){
        obs.func = () => {
            // the breed grid should expand to fill the space of the parent,
            // so we have to manually calculate the width and height
            const { width, height } = this.$parent.$el.getBoundingClientRect();
            this.width = width;
            this.height = height;
        }

        // once on initiation
        obs.func();

        // and again when the parent is resized
        obs.observer = new ResizeObserver(() => obs.func());

        obs.observer.observe(this.$parent.$el);
    },

    // clean up
    beforeDestroy(){
        // Commented out because it can cause an exception
        // However it's not totally necessary because it only
        // Gets replaced when remounted
        //obs.observer.disconnect();
        //obs.func = null;
        //obs.observer = null;
    },

    data(){
        return {
            width: 0,
            height: 0
        }
    },

    methods:{
        cellSizeAndPositionGetter(item, index){
            const
                containerWidth = this.width,
                portraitWidth = 36,
                portraitHeight = 48,
                margin = 2,
                columns = Math.floor(containerWidth / (portraitWidth + (margin * 2)));

            // compute size and position
            return {
                width: portraitWidth,
                height: portraitHeight,
                x: (index % columns) * (portraitWidth + margin),
                y: parseInt(index / columns) * (portraitHeight + margin)
            }
        }
    }
}
</script>

<style scoped>
.mates{
    list-style-type:none;
    margin: 0 auto;
}
.mates-compact .imgbox, .mates-list li {
    cursor: pointer;
}
.mates-compact{
    overflow: hidden auto;
}
.mates-list li{
    text-overflow: ellipsis;
    /*white-space: nowrap;*/
    overflow:hidden;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--breedDropDownColourFG);
}
.mates-list li:last-child{
    border:none;
}
.mates-list li .imgbox-fullsize{
    /* fix bug with flexbox */
    min-width: 34px;
    margin: 3px;
}
</style>