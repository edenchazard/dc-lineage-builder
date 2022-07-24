<template>
<TagList
    :atLeastOneEnabled="false"
    :value="$store.state.tags"
    @updated="$store.commit('setTags', $event)" />
</template>
<script>
import TagList from './ui/TagList.vue';

export default {
    name: "BreedTags",

    components: {
        TagList
    }
}
</script>