<template>
<TagList
    :atLeastOneEnabled="true"
    :value="$store.state.groups"
    @updated="$store.commit('setGroups', $event)" />
</template>
<script>
import TagList from './ui/TagList.vue';

export default {
    name: "BreedGroupsTagSelector",

    components: {
        TagList
    }
}
</script>