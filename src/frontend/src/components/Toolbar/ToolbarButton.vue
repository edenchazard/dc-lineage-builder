<template>
<button
    type="button"
    class='control'
    :class="{
        'dropdown': options
    }"
    :title="title"
    @click="$emit('click')">
    <font-awesome-icon :icon="icon" /> {{label}}
    <div
        v-if='options'
        class="options">
        <ul>
            <li
                v-for="option in options"
                class="option"
                :key="option.label"
                @click="$emit('optionSelected', option.value)">
                {{option.label}}</li>
        </ul>
    </div>
    <div
        v-else-if="$slots.dropdown"
        class="options">
        <slot name="dropdown">

        </slot>
    </div>
</button>
</template>

<script>
export default {
    name: 'ToolbarButton',
    props: {
        title: String,
        icon: String,
        label: String,
        click: Function,
        options: Array
    }
}
</script>

<style scoped>
.control{
    margin:2px 0px;
    cursor: pointer;
    padding: 8px;
    color:var(--builderControlFG);
    background: var(--builderControlBG);
    border:none;
    width:30px;
    height: 30px;
}
.control svg{
    padding:0px;
}
.dropdown{
    position: relative;
    z-index: 50;
}
.dropdown .options{
    display:none;
    position: absolute;
    z-index:1;
    color:var(--builderControlFG);
    background: var(--builderControlBG);
    right:0px;
    min-width: 50px;
    padding:5px;
}
.dropdown:focus .options{
    display:block;
    min-width: 140px;
    padding: 5px;
    text-align: left;
}
.option{
    padding:5px;
}
</style>