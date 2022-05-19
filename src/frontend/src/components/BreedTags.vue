<template>
<TagList
    :value="$store.state.tags"
    @updated="$store.commit('setTags', $event)" />
</template>
<script>
import TagList from '@/components/ui/TagList';

export default {
    name: "BreedTags",

    components: {
        TagList
    }
}
</script>