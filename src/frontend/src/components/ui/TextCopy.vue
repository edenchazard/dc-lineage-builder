<template>
    <div>
        <input
            v-if="type === 'input'"
            type='text'
            v-bind="$attrs"
            :value='value'
            class='text'
            readonly
            @input="$emit('input', $event.target.value)" />
        <textarea
            v-else
            v-bind="$attrs"
            :value='value'
            class='text'
            readonly
            @input="$emit('input', $event.target.value)">
        </textarea>
        <span>
            <button
                class='copy-button'
                type='button'
                @mousedown="copy">
                <font-awesome-icon icon="copy" /> Copy
                <span class='tooltip'>{{tooltip}}</span>
            </button>
        </span>
    </div>
</template>
<script>
export default {
  name: 'TextCopy',
  components: {  },
    props: {
        value: String,
        type: String
    },

  data(){
    return {
        tooltip: null
    }
  },

  methods:{
    updateValue(value) {
        this.$emit('input', value);
    },

    async copy(){
        try{
            await navigator.clipboard.writeText(this.value);
            this.tooltip = "Copied!";
        }
        catch(ex){
            this.tooltip = "Error copying";
        }
    }
  }
};
</script>
<style scoped>
div{
    display: flex;
    border-radius: 5px;
    align-items:center;
}
.text{
    flex:1;
}
.copy-button{
    border:0px none;
    background:inherit;
    color:var(--colourFG);
    position: relative;
}
.tooltip{
    display: none;
    position: absolute;
    background: var(--colourFG);
    color: var(--colourBG);
    padding: 5px;
    right:0px;
    top:28px;
}
.copy-button:hover{
    cursor: pointer;
}
.tooltip:after{
    content: "";
    display: block;
    position: absolute;
    right: 1rem;
    top: -9px;
    border-bottom: 10px solid var(--colourFG);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
}
.copy-button:active .tooltip{
    display: block;
}
</style>