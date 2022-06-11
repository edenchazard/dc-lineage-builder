<template>
    <span class='dragon-label'>
        <label
            v-if="!editing"
            class="label">
            <span
                v-if="display == 1"
                @click="clicked"
                class="code">({{value}})</span>
            <span
                v-else
                @click="clicked"
                class="name">{{value}}</span>
        </label>
        <span v-else>
            <input ref="inputel"
                :value="value"
                @keydown.enter="finishedEditing"
                @blur="finishedEditing"
                type="text" 
                class='input'
                placeholder="label" />
        </span>
    </span>
</template>
<script>
import { generateName, generateCode } from "../../app/dragonBuilder";

export default {
    name: 'DragonLabelField',
    components: { },
    props: {
        value: String,
        display: Number,
        disabled: Boolean
    },

    data() {
        return {
            editing: false
        }
    },

        /*
    filters:{
        formatSpaces: function(str){
            return str.replace(' ', '&nbsp;');
        }
    },*/

    methods:{
        clicked(){
            if(this.disabled){
                return;
            }

            this.editing = true;

            // focus the input so users can type immediately
            this.$nextTick(() => this.$refs.inputel.focus());
        },

        finishedEditing(e){
            let value = e.target.value;

            // we'll fill blanks in by automatically generating
            // a new string of name or code
            if(value == ''){
                if(this.display == 1){
                    value = generateCode();
                }
                else{
                    value = generateName();
                }
            }

            this.$emit('changed', value);
            this.editing = false;
        }
    }
};
</script>

<style scoped>
.dragon-label{
    width: 120px;
}
.code{
    font-style: italic;
}
.label{
    display: block;
    word-wrap: break-word;
    position: relative;
    top: -4px;
    border-collapse: collapse;
    white-space: break-spaces;
}
.input{
    border: 1px dashed #44300b;
    text-align: center;
    width: 114px;
    font-family: var(--lineageFont);
    font-size: 14px;
}

.input:focus{
    border: 1px dashed #44300b;
    background:transparent;
    color:var(--colourFG);
    border-color: inherit;
    -webkit-box-shadow: none;
    box-shadow: none;
    outline:none;
}
</style>