<template>
    <div class='tag-list'>
        <button
            v-for="(tag, index) in tagStates"
            :key="tag.name"
            :class="(tag.active ? 'tag-active' : 'tag-inactive')"
            type="button"
            @click="selected(index)">{{tag.name}}
        </button>
    </div>
</template>
<script>
export default {
    name: 'TagList',
    props: {
        //// object accepts [{ name: 'tag1', active: true}]
        value: Array,
        defaultActive: {
            type: Boolean,
            default: true
        },
        atLeastOneEnabled: {
            type: Boolean,
            default: false
        }
    },

    data(){
        // tag list can be an array or object (with definite states)
        // so we need to handle it appropriately. if array,
        // assume defaultActive
        let tagStates;
        if(!this.value[0]?.name){
            tagStates = this.value.map(tag => ({ 
                name: tag,
                active: this.defaultActive
            }));
        }
        else{
            tagStates = this.value;
        }

        return { tagStates };
    },

    methods:{
        selected(index){
            const
                tag = this.tagStates[index],
                newValue = !tag.active;

            // if this option is enabled, then we must ensure at least one tag
            // is enabled at all times,
            // to do this, we simply check the array of tags for actives and not
            // matching the selected tag name
            if(this.atLeastOneEnabled){
                const atLeastOne = this.tagStates.find(({active, name}) => {
                    return active && name !== tag.name
                });

                if(!atLeastOne){
                    return;
                }
            }

            this.tagStates[index].active = newValue;
            this.$emit('updated', this.tagStates);
        }
    }
};
</script>
<style scoped>
.tag-list button{
    padding:5px;
    color:#000;
    border-radius:5px;
    border:0px none;
    margin:3px 6px;
}
.tag-active{
    background:lightblue;
}
.tag-inactive{
    background:lightgray;
    color:#000;
}
</style>