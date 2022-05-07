<template>
    <div class='tag-list'>
        <button
            v-for="(tag, index) in tagStates"
            :key="tag.name"
            :class="(tag.active ? 'tag-active' : 'tag-inactive')"
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
            const tag = this.tagStates[index];
            this.tagStates[index].active = !tag.active;
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