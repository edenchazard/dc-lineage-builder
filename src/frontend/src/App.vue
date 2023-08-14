<template>
  <div
    id="app"
    :class="skinStore.activeSkin"
  >
    <Header />
    <main id="content">
      <router-view :key="route.fullPath" />
    </main>
  </div>
</template>

<script setup lang="ts">
import 'reset-css';
import { useRoute } from 'vue-router';
import './assets/styling/style.css';
import './assets/layouts/theming.css';
import Header from './components/Page/Header/Header.vue';
import { useSkinStore } from './store/skin';

const route = useRoute();
const skinStore = useSkinStore();
</script>

<style>
#app {
  background: var(--dc-background);
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

#content {
  color: var(--ui-content-fg);
  margin-top: 0.5rem;
  flex: 1;
  font-size: 1rem;
  line-height: 1.7em;
}
</style>
