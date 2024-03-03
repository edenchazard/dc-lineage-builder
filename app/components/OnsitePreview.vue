<!-- eslint-disable vue/no-v-html -->
<template>
  <ul id="lineage">
    <li>
      <div>
        <span class="border">
          <img
            src="../assets/images/placeholder.png"
            alt="result placeholder"
          />
        </span>
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
<style scoped lang="postcss">
#lineage {
  margin: 0 auto;
  font: var(--dc-lineage-font);
  color: var(--dc-lineage-colour);
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  box-sizing: border-box;
  flex: 1;
}
:deep(li::before),
:deep(li::after) {
  content: '';
  display: block;
  width: 24px;
  position: absolute;
  height: 50%;
  left: 0;
  border-left: var(--dc-lineage-line-width) var(--dc-lineage-line-style)
    var(--dc-lineage-line-colour);
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
:deep(li::before) {
  bottom: calc(50% + 12px);
  border-bottom: var(--dc-lineage-line-width) var(--dc-lineage-line-style)
    var(--dc-lineage-line-colour);
}
:deep(li::after) {
  top: calc(50% - 14px);
  bottom: auto;
  border-bottom: 0 none;
  border-top: var(--dc-lineage-line-width) var(--dc-lineage-line-style)
    var(--dc-lineage-line-colour);
}
:deep(div::after) {
  content: '';
  position: absolute;
  top: calc(50% - 12px);
  right: 0;
  border-top: var(--dc-lineage-line-width) var(--dc-lineage-line-style)
    var(--dc-lineage-line-colour);
  width: 24px;
  height: 0;
}

:deep(a),
.border {
  width: var(--size36x48W);
  height: var(--size36x48H);
  display: inline-block;
  overflow: hidden;
  border: 1px solid var(--dc-lineage-line-colour);
  background: var(--dc-lineage-tile-background, transparent);
  box-sizing: border-box;
}

:deep(img) {
  margin: -1px -1px;
  width: inherit;
  height: inherit;
}

/* fixes the tiny tiles */
:deep(li li li li li li a) {
  width: var(--size24x32W) !important;
  height: var(--size24x32H) !important;
}
/* fix for the bar showing up on the rightmost gen */
:deep(li div:last-child::after) {
  display: none;
}
</style>
