<template>
  <nav>
    <RouterLink
      v-for="[url, label] in links"
      :key="label"
      :to="url"
    >
      {{ label }}
    </RouterLink>
    <a href="https://chazza.me/dc/tools">More tools</a>
    <a href="https://dragcave.net/"
      >Dragcave.net
      <FontAwesomeIcon icon="external-link" />
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
