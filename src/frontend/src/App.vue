<template>
  <div id="dialogs"></div>
  <Header />
  <main id="content">
    <router-view :key="route.fullPath" />
  </main>
  <footer id="bottom">
    <div
      id="footer"
      class="constrain-width"
    >
      <div id="footer-external-links">
        <a href="https://ko-fi.com/dctools">
          <FontAwesomeIcon
            icon="fa-solid fa-mug-hot"
            size="2x"
          />Donation link
        </a>
        <a href="https://github.com/edenchazard/dc-lineage-builder">
          <FontAwesomeIcon
            icon="fa-brands fa-github"
            size="2x"
          />Github
        </a>
      </div>
      v{{ appStore.appVersion }} &copy; eden chazard
      <SkinSwitcher id="desktop-menu-skin-switcher" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import 'reset-css';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './assets/styling/style.css';
import './assets/layouts/theming.css';
import { useAppStore } from './store/app';
import Header from './components/Page/Header/Header.vue';
import SkinSwitcher from './components/Page/Header/SkinSwitcher.vue';

const route = useRoute();
const appStore = useAppStore();
</script>

<style>
#content {
  color: var(--ui-content-fg);
  flex: 1;
  font-size: 1rem;
  line-height: 1.7em;
  background: var(--dc-background);
  padding-top: 1rem;
}

#bottom {
  background: var(--ui-footer-bg);
  color: var(--ui-footer-fg);
  text-align: center;
  padding: 0.5rem;
}

#footer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  flex-wrap: wrap;
}

#footer-external-links {
  display: flex;
  gap: 0.5rem;
}

#footer-external-links a {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  text-align: center;
  white-space: nowrap;
}

@media (min-width: 38em) {
  #footer {
    flex-direction: row;
  }
}
</style>
