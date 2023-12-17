<template>
  <nav>
    <RouterLink
      v-for="[url, label] in links"
      :key="label"
      :to="url"
    >
      <span class="link-text">
        {{ label }}
      </span>
    </RouterLink>
    <a href="https://chazza.me/dc/tools">
      <span class="link-text"> More tools </span>
    </a>
    <a href="https://dragcave.net/">
      <span class="link-text">
        Dragcave.net
        <FontAwesomeIcon icon="external-link" />
      </span>
    </a>
  </nav>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const links = [
  ['/', 'Build'],
  ['/checkers', 'Checker Generator'],
  ['/ghost-breeds', 'Ghost breeds'],
  ['/onsite-preview', 'Onsite Preview'],
  ['/tutorial', 'Tutorial'],
  ['/disclaimer', 'Disclaimer'],
];
</script>

<style scoped></style>
