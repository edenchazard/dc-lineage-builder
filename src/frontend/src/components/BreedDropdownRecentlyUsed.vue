<template>
    <div>
        <ul class='recently-used'>
            <li
                v-for="breed in recentlyUsed"
                :key="breed.name"
                @click="$emit('selected', breed)">
                <DragonPortrait
                    :title="breed.name"
                    :data="breed" />
            </li>
        </ul>
    </div>
</template>
<script>
import DragonPortrait from "@/components/DragonPortrait";

export default {
    name: 'BreedDropdownRecentlyUsed',
    components: { DragonPortrait },
    props: {
        recentlyUsed: Array
    }
};
</script>

<style scoped>
.recently-used li{
    display: inline-block;
    margin:5px;
    cursor: pointer;
}
</style>