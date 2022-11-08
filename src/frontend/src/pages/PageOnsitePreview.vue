<template>
<div class='central-block'>
    <section id='onsite-combine'>
        <form @submit="fetchLineage">
            <label for="male">Male: </label>
            <input
                type="text"
                min="4"
                max="5"
                id="male"
                v-model="maleCode" />
            <label for="female">Female: </label>
            <input
                type="text"
                min="4"
                max="5"
                id="female"
                v-model="femaleCode" />
            <button type="submit">Preview</button>
        </form>
    </section>
    <section
        v-if="htmlPreview !== ''"
        id="lineage"
        v-html="htmlPreview">

    </section>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getPreviewOnsite } from '../app/api';

const htmlPreview = ref("");
const maleCode = ref("");
const femaleCode = ref("");

async function fetchLineage(e: Event){
    e.preventDefault();

    const response = await getPreviewOnsite(maleCode.value, femaleCode.value);
    htmlPreview.value = response.data.html;
}
</script>

<style scoped>
#lineage >>> li::after{
    content: "";
    position: absolute;
    top: calc(50% - 12px);
    right: 0;
    border-top: var(--lineageLineStyle);
    width: 24px;
    height: 0;
}
#lineage >>> li:only-child::after {
    display: none;
}
#lineage >>> li {
    position: relative;
    list-style-type: none;
    border-spacing: 1px;
    border-collapse: collapse;
}
#lineage >>> ul, #lineage >>> li {
    padding: 0;
    margin: 0;
}
#lineage >>> li:first-child::before, #lineage >>> li:last-child::after {
    display: none;
}
#lineage >>> li::before, #lineage >>> li::after {
    content: "";
    display: block;
    border-left: var(--lineageLineStyle);
    border-bottom: var(--lineageLineStyle);
    width: 24px;
    position: absolute;
    height: 50%;
    bottom: calc(50% + 12px);
    left: 0;
}
#lineage >>> li:last-child>* {
    padding-bottom: 0;
}
#lineage >>> li:first-child>* {
    padding-top: 0;
}
#lineage >>> li>* {
    display: table-cell;
    vertical-align: middle;
}
#lineage >>> div {
    text-align: center;
    position: relative;
    width: 120px;
    padding: 0 4px;
    box-sizing: border-box;
}
#lineage >>> label {
    display: block;
    width: 120px;
    word-wrap: break-word;
    position: relative;
    top: -4px;
}
#lineage >>> li::after {
    top: calc(50% - 14px);
    bottom: auto;
    border-bottom: 0 none;
    border-top: var(--lineageLineStyle);
}
#lineage{
  margin:0px auto;
  font-family: var(--lineageFont);
  background:inherit;
  line-height: 19.6px;
  display: flex;
  flex-direction: column;
}
#lineage{
  padding: 1px;
  background:inherit;
  display: flex;
  margin:0px auto;
}
</style>