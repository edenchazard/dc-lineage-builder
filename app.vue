<template>
  <DialogSettings
    :open="settingsDialogOpen"
    @close="settingsDialogOpen = false"
  />
  <Header />
  <main id="content">
    <NuxtPage />
  </main>
  <footer id="bottom">
    <div
      id="footer"
      class="constrain-width"
    >
      <div id="footer-links">
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
        <button
          class="pointer"
          type="button"
          @click="settingsDialogOpen = true"
        >
          <font-awesome-icon
            icon="fa-solid fa-cog"
            size="2x"
          />Settings
        </button>
      </div>
      <div id="footer-version">
        v{{ appStore.appVersion }}
        <div>eden chazard</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useDevicePixelRatio } from '@vueuse/core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useAppStore } from '~/stores/useAppStore';
import Header from '~/components/TheHeader.vue';
import { injectBreedList } from '~/utils/breeds';
import DialogSettings from '~/components/DialogSettings.vue';

const appStore = useAppStore();

const settingsDialogOpen = ref(false);

const { pixelRatio } = useDevicePixelRatio();
let use72 = false;

/* dynamically load sprite sheets based on pixel ratio */
watch(
  pixelRatio,
  async () => {
    if (pixelRatio.value > 1) {
      await Promise.all([
        import('~/assets/tile-rendering/sprites-72x96-0.css'),
        import('~/assets/tile-rendering/sprites-72x96-1.css'),
        import('~/assets/tile-rendering/sprites-72x96-2.css'),
        import('~/assets/tile-rendering/sprites-72x96-3.css'),
        import('~/assets/tile-rendering/sprites-72x96-4.css'),
        import('~/assets/tile-rendering/sprites-72x96-5.css'),
      ]);
      use72 = true;
    } else if (!use72) {
      await Promise.all([
        import('~/assets/tile-rendering/sprites-36x48-0.css'),
        import('~/assets/tile-rendering/sprites-36x48-1.css'),
        import('~/assets/tile-rendering/sprites-36x48-2.css'),
        import('~/assets/tile-rendering/sprites-36x48-3.css'),
        import('~/assets/tile-rendering/sprites-36x48-4.css'),
        import('~/assets/tile-rendering/sprites-36x48-5.css'),
      ]);
    }
  },
  { immediate: true },
);

onMounted(async () => {
  await injectBreedList();
});
</script>

<style>
#content {
  color: var(--ui-content-fg);
  flex: 1;
  font-size: 1rem;
  line-height: 1.7em;
  background: var(--dc-background);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
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

#footer-links {
  display: flex;
  gap: 0.5rem;
}

#footer-links a,
#footer-links button {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  white-space: nowrap;
  border: 0;
  background: none;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  text-decoration: underline;
  font-family: inherit;
  color: var(--ui-footer-btn);

  & svg {
    margin: 0 auto;
  }
}

#footer-version {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

@media (min-width: 38em) {
  #footer {
    flex-direction: row;
  }

  #footer-version {
    align-self: flex-end;
    text-align: right;
  }
}
</style>