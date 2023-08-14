<template>
  <header id="top">
    <SlideInMenu
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
          class="menu-button"
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
      <HeaderMenuLinks id="mobile-menu" />
      <div
        id="mobile-menu-skin-section"
        class="mobile-menu-section"
      >
        <SkinSwitcher id="mobile-menu-skin-switcher" />
      </div>
      <div id="mobile-menu-external-links">
        <a href="https://ko-fi.com/dctools">
          <FontAwesomeIcon
            icon="fa-solid fa-mug-hot"
            size="2x"
          />
          Donation link
        </a>
        <a href="https://github.com/edenchazard/dc-lineage-builder">
          <FontAwesomeIcon
            icon="fa-brands fa-github"
            size="2x"
          />
          Github
        </a>
      </div>
      <div id="mobile-menu-footer">
        v{{ appStore.appVersion }} &copy; eden chazard
      </div>
    </SlideInMenu>

    <div
      id="header"
      class="constrain-width"
    >
      <button
        id="mobile-menu-button"
        class="col-1 menu-button"
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
      <HeaderMenuLinks id="desktop-menu" />
      <div class="col-3">
        <div class="skin">
          <SkinSwitcher
            id="desktop-menu-skin-switcher"
            :show-label="false"
          />
        </div>
        <div class="external-links">
          <a
            title="Github"
            href="https://github.com/edenchazard/dc-lineage-builder"
          >
            <FontAwesomeIcon
              icon="fa-brands fa-github"
              size="2x"
            />
          </a>
          <a
            title="Ko-fi donation link"
            href="https://ko-fi.com/dctools"
          >
            <FontAwesomeIcon
              icon="fa-solid fa-mug-hot"
              size="2x"
            />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onKeyDown } from '@vueuse/core';
import { useAppStore } from '../../../store/app';
import HeaderMenuLinks from './HeaderMenuLinks.vue';
import SkinSwitcher from './SkinSwitcher.vue';
import SlideInMenu from './SlideInMenu.vue';

onKeyDown('Escape', () => (menuOpen.value = false));

const appStore = useAppStore();
const menuOpen = ref(false);
</script>

<style>
#top {
  background: var(--ui-header-bg);
  color: var(--ui-header-fg);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  /*   padding: 0.25rem 0.5rem; */
}
#top a {
  text-decoration: none;
}

#header {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: inherit;
  /*   box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.75); */
  margin: 0 auto;
}

#site-title {
  font-size: 1.8em;
  line-height: 1.8em;
  white-space: nowrap;
  color: inherit;
  flex: 1;
}
#site-title-link {
  color: inherit;
}
.menu-button {
  height: 3rem;
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
#header .skin {
  white-space: nowrap;
}
#header .external-links {
  display: flex;
  justify-content: space-evenly;
  gap: 0.5rem;
  flex: 1;
  text-align: center;
}
#header .external-links a {
  color: inherit;
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
#mobile-menu-skin-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}
#mobile-menu-skin-switcher {
  align-self: stretch;
}
#mobile-menu-external-links {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
#mobile-menu-external-links a {
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  text-align: center;
}
#mobile-menu-footer {
  text-align: center;
  padding: 1rem 0rem;
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
}

#desktop-menu a {
  color: inherit;
  display: flex;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
}
</style>
