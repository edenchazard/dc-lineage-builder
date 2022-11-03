<template>
    <span class='generation-counter'>
      <span class='generation' v-for="index in count" :key="index">
        {{count - index + 1}}
      </span>
    </span>
</template>
<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 1
  }
});
</script>
<style scoped>
.generation-counter{
  position: relative;
  display: flex;
  left: 2px;
  height: 16px;
  line-height: 16px;
  margin: 0px auto;
}
.generation:first-child {
  border-left:  var(--lineageLineStyle);
}
.generation {
  /*display: inline-block;*/
  position: relative;
  width: 128px;
  box-sizing: border-box;
  text-align: center;
  color: var(--lineageGenColour);
  border-right: var(--lineageLineStyle);
}
.generation::before {
  left: 0;
}
.generation::after {
  right: 0;
}
.generation::before, .generation::after {
  content: "";
  position: absolute;
  top: 8px;
  width: 52px;
  border-top: var(--lineageLineStyle);
}
</style>