<template>
  <img
    v-if="!inviteDismissed"
    id="garden-mint"
    src="https://dragcave.net/image/rnTk.gif"
    alt="Garden mint"
    @animationend="showInvite()"
  />
  <div
    v-if="invitationOpen"
    id="garden-message"
  >
    <p>
      Pssst! I'm Matthias the Mint dragon, here to invite you to the
      <a href="https://chazza.me/dc/hatchery">Garden of Eden</a>
      &mdash; a brand new hatchery!
      <button
        type="button"
        @click="
          () => {
            inviteDismissed = true;
            invitationOpen = false;
          }
        "
      >
        Begone, Matthias!
      </button>
    </p>
  </div>
  <a
    href="#content"
    class="sr-only"
    >Skip to content</a
  >
  <header id="top">
    <TheSlideInMenu
      id="mobile-menu-wrapper"
      :open="menuOpen"
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
import { onKeyDown, useLocalStorage } from '@vueuse/core';
import TheHeaderMenuLinks from './TheHeaderMenuLinks.vue';
import TheSlideInMenu from './TheSlideInMenu.vue';
import router from '../router/router';

const menuOpen = ref(false);
const invitationOpen = ref(false);
const inviteDismissed = useLocalStorage('inviteDismissed', false);

onKeyDown('Escape', () => (menuOpen.value = false));

router.afterEach(() => (menuOpen.value = false));

function showInvite() {
  invitationOpen.value = true;
}
</script>

<style>
#top {
  background: var(--ui-header-bg);
  color: var(--ui-header-fg);
  z-index: 15;
  position: relative;
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
  position: relative;
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

#garden-mint {
  position: absolute;
  rotate: 180deg;
  z-index: 1;
  top: 0;
  left: 0.5rem;
  animation: gardener 3s forwards 1;
}

#garden-message {
  position: absolute;
  top: 4rem;
  left: 0;
  z-index: 14;
  background: var(--dc-background);
  color: var(--dialog-body-fg);
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--dc-lineage-colour);
  box-shadow: 0px 0px 15px -2px black;
  animation: message 1.5s forwards 1;
  max-width: 14rem;
}

@keyframes gardener {
  0% {
    transform: translateY(-2.5rem);
  }
  50% {
    transform: translateY(-2rem);
  }
  75% {
    transform: translateY(-2.5rem);
  }
  100% {
    transform: translateY(-3.5rem) rotate(90deg);
  }
}

@keyframes message {
  0% {
    transform: translateX(2rem);
    opacity: 0;
  }
  100% {
    transform: translateX(3.5rem);
    opacity: 1;
  }
}
</style>
