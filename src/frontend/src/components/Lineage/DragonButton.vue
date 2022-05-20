<template>
<button
    class='control'
    type="button"
    :title="title"
    @click="$emit('click')">
    <font-awesome-icon :icon="icon" /></button>
</template>

<script>
export default {
    name: "DragonButton",
    props: {
        title: String,
        icon: String
    }
}
</script>
<style scoped>
.control {
    border: 0px none;
    color: var(--lineageToolColour);
    background:transparent;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 18px;
    cursor: pointer;
    border-radius: 3px;
    padding: 0px;
    width:30px;
    height: 29.38px;
}
.control svg{
    padding:0px;
}
</style>