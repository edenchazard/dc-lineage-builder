<template>
    <ul
        v-if="breeds.length > 0"
        :class="compact ? 'mates-compact' : 'mates-list'" 
        class='mates'>
        <li
            v-for="breed in breeds"
            :key="breed.name"
            @click="$emit('selected', breed)">
            <DragonPortrait
                :data="breed" />
                {{compact ? '' : breed.name}}
        </li>
    </ul>
</template>

<script>
import DragonPortrait from "@/components/DragonPortrait";

export default {
    name: 'BreedGrid',
    components: { DragonPortrait },
    props: {
        breeds: Array,
        compact: Boolean
    }
}
</script>

<style scoped>
.mates{
    list-style-type:none;
    margin: 0 auto;
}
.mates li{
    cursor: pointer;
}
.mates-compact{
    display: grid;
    grid-template-columns: repeat(auto-fill, 36px);
    grid-auto-rows: 1fr;
    grid-gap: 2px;
}
.mates-compact li{
    height: 48px;
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