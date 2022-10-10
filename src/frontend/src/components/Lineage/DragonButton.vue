<template>
<button
    class='control'
    type="button"
    :title="title">
    <font-awesome-icon :icon="icon" /></button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DragonButton",
    props: {
        title: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        }
    }
});
</script>
<style scoped>
.control {
    border: 0px none;
    color: var(--lineageToolColour);
    background:transparent;
    font-size: 18px;
    cursor: pointer;
    padding: 0px;
    width:30px;
    height: 29.38px;
}
.control svg{
    padding:0px;
}
</style>