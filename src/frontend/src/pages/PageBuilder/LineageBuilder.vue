<template>
  <div
    ref="builder"
    class="builder-container"
  >
    <div class="central-block">
      <Feedback ref="status" />
    </div>
    <div
      v-if="appStore.activeTree !== null"
      class="lineage-builder"
    >
      <Toolbar
        :config="config"
        :tree="appStore.activeTree"
        @updateConfig="(key, value) => (config[key] = value)"
        @importTree="(newTree) => (appStore.activeTree = newTree)"
        @unselectAll="unselectAll"
        @changeBreed="selectionChangeBreed"
        @displayNames="selectionSwitchLabel(0)"
        @displayCodes="selectionSwitchLabel(1)"
        @selectCriteria="selectionCriteria"
        @randomizeLabels="selectionRandomizeLabels"
        @deleteAncestors="selectionDeleteAncestors"
        @addParents="selectionAddParents"
        @switchParents="selectionSwitchParents"
        @fullscreen="fullscreen.toggle"
        @undo="appStore.treeHistory.undo"
        @redo="appStore.treeHistory.redo"
      />
      <Lineage
        class="builder"
        :root="appStore.activeTree"
        :config="config"
        @contextmenu="() => false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
//todo fix @updateConfig="(key, value) => config[key] = value"
import * as dragonBuilder from '../../app/dragonBuilder';
import { forEveryDragon, hasParents } from '../../app/utils';
import { getLineage } from '../../app/api';
import { useAppStore } from '../../store/app';
import {
  LineageRoot,
  DragonType,
  DragonDisplay,
  LineageConfig,
} from '../../app/types';

import Toolbar from '../../components/Toolbar/Toolbar.vue';
import Lineage from '../../components/Lineage/Lineage.vue';
import Feedback from '../../components/UI/Feedback.vue';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useFullscreen } from '@vueuse/core';

const route = useRoute();
const appStore = useAppStore();
const builder = ref(null);
const fullscreen = useFullscreen(builder);
const config = reactive<LineageConfig>({
  showInterface: true,
  showLabels: true,
  disabled: false,
});
const status = ref<InstanceType<typeof Feedback>>();

onMounted(async () => {
  if (!status.value) return;

  const hash = route.query.template as string | undefined;
  const starterTree = () => {
    appStore.activeTree = dragonBuilder.createDragonProperties();
    appStore.treeHistory.clear();
  };

  // No template, so start from scratch
  if (hash === undefined) starterTree();
  // the user has requested we import from an already built lineage.
  else {
    try {
      status.value.info({
        message: `Loading template... For big lineages, this can take a moment to load.`,
        showDismiss: false,
      });

      // fetch from server
      const response = await getLineage(hash);

      // there were errors, display them and default back to an empty lineage.
      if (response.errors.length > 0) {
        status.value.update(response.errors);
        starterTree();
        return;
      }

      const savedTree = response.data.lineage;

      // add selection data
      forEveryDragon(savedTree, (dragon) => (dragon.selected = false));

      status.value.close(() => {
        appStore.activeTree = savedTree;
      });
    } catch (ex) {
      status.value.error(ex.message);
      starterTree();
    }
  }
});

// reset stuff
// tree can be a large memory hog, and gc doesn't always get to it immediately.
onBeforeUnmount(() => (appStore.activeTree = null));

// Accepts a callback
// Or a key and the value to change it to
function applyToSelected(callback: (dragon: DragonType) => void): void;
function applyToSelected(key: keyof DragonType, value: any): void;
function applyToSelected(
  keyOrCallback: keyof DragonType | ((dragon: DragonType) => void),
  value?: any,
) {
  if (typeof keyOrCallback === 'string') {
    const key = keyOrCallback.toString();
    forEveryDragon(appStore.activeTree as LineageRoot, (dragon) => {
      if (dragon.selected) dragon[key] = value;
    });
  } else if (typeof keyOrCallback === 'function') {
    const callback = keyOrCallback;
    forEveryDragon(appStore.activeTree as LineageRoot, (dragon) => {
      if (dragon.selected) callback(dragon);
    });
  }
}

function selectionCriteria(callback: (dragon: DragonType) => boolean): void;
function selectionCriteria(key: keyof DragonType, value: any): void;
function selectionCriteria(
  keyOrCallback: keyof DragonType | ((dragon: DragonType) => boolean),
  value?: any,
) {
  if (typeof keyOrCallback === 'string') {
    const key = keyOrCallback.toString();
    selectBy((dragon) => dragon[key] === value);
  } else if (typeof keyOrCallback === 'function') {
    const condition = keyOrCallback;
    selectBy(condition);
  }
}

function selectionChangeBreed(breedName: string) {
  forEveryDragon(appStore.activeTree as LineageRoot, (dragon) => {
    if (dragon.selected) dragon.breed = breedName;
  });
}

function selectionDeleteAncestors() {
  applyToSelected('parents', {});
}

function selectionAddParents() {
  applyToSelected((dragon) => {
    if (!hasParents(dragon)) {
      dragon.parents = {
        m: dragonBuilder.createDragonProperties({ gender: 'm' }),
        f: dragonBuilder.createDragonProperties({ gender: 'f' }),
      };
    }
  });
}

function selectionSwitchParents() {
  applyToSelected((dragon) => {
    // no parents, ignore
    if (!hasParents(dragon)) return;
    dragon.parents = dragonBuilder.switchParents(dragon.parents);
  });
}

function selectionRandomizeLabels() {
  applyToSelected((dragon) => {
    if (dragon.display === 0) dragon.name = dragonBuilder.generateName();
    else dragon.code = dragonBuilder.generateCode();
  });
}

function selectionSwitchLabel(display: DragonDisplay) {
  applyToSelected('display', display);
}

function unselectAll() {
  applyToSelected('selected', false);
}

function selectBy(condition: (dragon: DragonType) => boolean) {
  forEveryDragon(appStore.activeTree as LineageRoot, (dragon: DragonType) => {
    if (!dragon.selected && condition(dragon)) dragon.selected = true;
  });
}
</script>

<style scoped>
.builder-container:fullscreen {
  background: var(--builderBG);
  height: 100vh;
  width: 100vh;
  overflow: auto;
}
.lineage-builder {
  font-family: var(--lineageFont);
}
.builder {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
    supported by Chrome, Edge, Opera and Firefox */
}
</style>
