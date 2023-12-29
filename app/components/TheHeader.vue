<template>
  <a
    href="#content"
    class="sr-only"
    >Skip to content</a
  >
  <header id="top">
    <TheSlideInMenu
      id="mobile-menu-wrapper"
      :open="menuOpen"
      :slide-threshold="1002"
      @change="(state) => (menuOpen = state)"
    >
      <div
        id="mobile-menu-top"
        class="mobile-menu-section"
      >
        <button
          class="menu-button pointer"
          type="button"
          @click="menuOpen = false"
        >
          Close
          <FontAwesomeIcon
            icon="times"
            class="icon"
          />
        </button>
      </div>
      <TheHeaderMenuLinks id="mobile-menu" />
    </TheSlideInMenu>

    <div
      id="header"
      class="constrain-width"
    >
      <button
        id="mobile-menu-button"
        class="col-1 menu-button pointer"
        type="button"
        @click="menuOpen = !menuOpen"
      >
        <FontAwesomeIcon
          id="burger"
          icon="bars"
        />
        Menu
      </button>
      <span id="site-title">
        <router-link
          id="site-title-link"
          to="/"
          >Lineage Builder
        </router-link>
      </span>
      <TheHeaderMenuLinks id="desktop-menu" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onKeyDown } from '@vueuse/core';
import TheHeaderMenuLinks from './TheHeaderMenuLinks.vue';
import TheSlideInMenu from './TheSlideInMenu.vue';

onKeyDown('Escape', () => (menuOpen.value = false));

const menuOpen = ref(false);
</script>

<style>
#top {
  background: var(--ui-header-bg);
  color: var(--ui-header-fg);
  /* padding-top: 0.5rem;
  padding-bottom: 0.5rem; */
  /*   padding: 0.25rem 0.5rem; */
}

#top a {
  text-decoration: none;
}

#mobile-menu-button {
  align-self: stretch;
}

#header {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: inherit;
  /*   box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.75); */
  margin: 0 auto;
  gap: 0.5rem;
}

#site-title {
  font-size: 1.8em;
  line-height: 1.8em;
  white-space: nowrap;
  color: inherit;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
#site-title-link {
  color: inherit;
}

.menu-button {
  padding: 1rem 0.25rem;
  background: none;
  color: #fff;
  text-transform: uppercase;
  white-space: nowrap;
  border: none;
}

#header .col-3 {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
}
/**
mobile menu
*/
#mobile-menu-wrapper {
  background: var(--ui-header-bg);
  color: var(--ui-header-fg);
  box-shadow: 0px 0px 15px -2px darkgrey;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.mobile-menu-section {
  padding: 0rem 0.5rem;
}
#mobile-menu-top,
#mobile-menu-bottom {
  text-align: right;
}
#mobile-menu a {
  color: inherit;
  padding: 1rem 0rem 1rem 1rem;
  display: block;
  text-decoration: none;
  border-bottom: var(--ui-header-mobile-border);
}

#mobile-menu a:last-child {
  border: 0px none;
}

/**
desktop menu
*/
#desktop-menu {
  margin-left: 1rem;
  display: none;
  gap: 0.5rem;
  justify-content: stretch;
  align-self: stretch;
  flex: 1;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

#desktop-menu a {
  color: inherit;
  display: flex;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
}
</style>
