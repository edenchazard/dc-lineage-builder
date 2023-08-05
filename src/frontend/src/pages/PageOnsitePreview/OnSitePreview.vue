<!-- eslint-disable vue/no-v-html -->
<template>
  <ul id="lineage">
    <li>
      <div>
        <img
          src="../../assets/images/placeholder.png"
          alt="result placeholder"
        />
        <label>Result</label>
      </div>
      <ul
        v-if="htmlPreview !== ''"
        v-html="htmlPreview"
      ></ul>
    </li>
  </ul>
</template>
<script setup lang="ts">
defineProps({
  htmlPreview: {
    type: String,
    required: true,
  },
});
</script>
<style scoped>
#lineage {
  margin: 0px auto;
  font-family: var(--lineageFont);
  background: inherit;
  line-height: 19.6px;
  display: flex;
  flex-direction: column;
}
#lineage {
  padding: 1px;
  background: inherit;
  display: flex;
  margin: 0px auto;
}
:deep(#lineage > ul) {
  /* center lineage */
  margin: 0px auto;
}
:deep(li::after) {
  content: '';
  position: absolute;
  top: calc(50% - 12px);
  right: 0;
  border-top: var(--lineageLineStyle);
  width: 24px;
  height: 0;
}
:deep(li::after) {
  content: '';
  position: absolute;
  top: calc(50% - 12px);
  right: 0;
  border-top: var(--lineageLineStyle);
  width: 24px;
  height: 0;
}
:deep(li:only-child::after) {
  display: none;
}
:deep(li) {
  position: relative;
  list-style-type: none;
  border-spacing: 1px;
  border-collapse: collapse;
}
:deep(ul),
:deep(li) {
  padding: 0;
  margin: 0;
}
:deep(li:first-child::before),
:deep(li:last-child::after) {
  display: none;
}
:deep(li::before),
:deep(li::after) {
  content: '';
  display: block;
  border-left: var(--lineageLineStyle);
  border-bottom: var(--lineageLineStyle);
  width: 24px;
  position: absolute;
  height: 50%;
  bottom: calc(50% + 12px);
  left: 0;
}
:deep(li:last-child > *) {
  padding-bottom: 0;
}
:deep(li:first-child > *) {
  padding-top: 0;
}
:deep(li > *) {
  display: table-cell;
  vertical-align: middle;
}
:deep(div) {
  text-align: center;
  position: relative;
  width: 120px;
  padding: 0 4px;
  box-sizing: border-box;
}
:deep(label) {
  display: block;
  width: 120px;
  word-wrap: break-word;
  position: relative;
  top: -4px;
}
:deep(label > i) {
  font-style: italic;
}
:deep(li::after) {
  top: calc(50% - 14px);
  bottom: auto;
  border-bottom: 0 none;
  border-top: var(--lineageLineStyle);
}
:deep(div::after) {
  content: '';
  position: absolute;
  top: calc(50% - 12px);
  right: 0;
  border-top: var(--lineageLineStyle);
  width: 24px;
  height: 0;
}
/* fix for the bar showing up on the rightmost gen */
:deep(li div:last-child::after) {
  display: none;
}
</style>
