<template>
    <div>
        <input
            v-if="type === 'input'"
            type='text'
            v-bind="$attrs"
            :value='value'
            class='text'
            @input="$emit('input', $event.target.value)" />
        <textarea
            v-else
            v-bind="$attrs"
            :value='value'
            class='text'
            @input="$emit('input', $event.target.value)">
        </textarea>
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
    return { }
  },

  methods:{
    updateValue: function (value) {
        this.$emit('input', value);
    }
  }
};
</script>
<style scoped>
div{
    display: flex;
    border-radius: 5px;
}
.text{
    flex:1;
}
button{
    width:30px;
    border:0px none;
}
</style>