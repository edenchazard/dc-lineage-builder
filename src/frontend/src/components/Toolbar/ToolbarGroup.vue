<template>
  <div class="group">
    <div class="buttons">
      <slot></slot>
    </div>
    <span
      class="legend"
      v-if="$slots.legend"
      ><slot name="legend"></slot
    ></span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  justify-content: space-between;
}
.legend {
  display: block;
  width: 100%;
  background: var(--builderControlBG);
  color: var(--builderControlFG);
  text-align: center;
  border-radius: 0px 0px 5px 5px;
  padding: 3px;
  box-sizing: border-box;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 12px;
}
.buttons {
  display: flex;
}
</style>
