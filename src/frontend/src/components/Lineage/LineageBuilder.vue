<template>
  <div
    ref="builder"
    class="builder-container"
  >
    <Toolbar
      v-if="appStore.activeTree !== null"
      :config="config"
      :tree="appStore.activeTree"
      @update-config="(key, value) => (config[key] = value)"
      @import-tree="(newTree) => (appStore.activeTree = newTree)"
      @unselect-all="unselectAll"
      @change-breed="selectionChangeBreed"
      @display-names="selectionSwitchLabel(0)"
      @display-codes="selectionSwitchLabel(1)"
      @select-criteria="selectionCriteria"
      @randomize-labels="selectionRandomizeLabels"
      @delete-ancestors="selectionDeleteAncestors"
      @add-parents="selectionAddParents"
      @switch-parents="selectionSwitchParents"
      @fullscreen="fullscreen.toggle"
      @undo="appStore.treeHistory.undo"
      @redo="appStore.treeHistory.redo"
    />
    <div class="central-block">
      <Feedback ref="status" />
    </div>
    <Lineage
      v-if="appStore.activeTree !== null"
      :root="appStore.activeTree"
      :config="config"
      @contextmenu="() => false"
    />
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

      const savedTree = forEveryDragon(
        response.data.lineage,

        // add selection data
        (dragon) => (dragon.selected = false),
      );

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

/**
 * Updates the tree
 * @param callback Callback to perform on each dragon node
 */
function updateTree(callback: (dragon: DragonType) => void): void {
  appStore.activeTree = forEveryDragon(
    appStore.activeTree as LineageRoot,
    callback,
  );
}

// Accepts a callback
// Or a key and the value to change it to
function applyToSelected(callback: (dragon: DragonType) => void): void;
function applyToSelected(key: keyof DragonType, value: unknown): void;
function applyToSelected(
  keyOrCallback: keyof DragonType | ((dragon: DragonType) => void),
  value?: unknown,
) {
  if (typeof keyOrCallback === 'string') {
    const key = keyOrCallback.toString();
    updateTree((dragon) => {
      if (dragon.selected) dragon[key] = value;
    });
  } else if (typeof keyOrCallback === 'function') {
    const callback = keyOrCallback;
    updateTree((dragon) => {
      if (dragon.selected) callback(dragon);
    });
  }
}

function selectionCriteria(callback: (dragon: DragonType) => boolean): void;
function selectionCriteria(key: keyof DragonType, value: unknown): void;
function selectionCriteria(
  keyOrCallback: keyof DragonType | ((dragon: DragonType) => boolean),
  value?: unknown,
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
  updateTree((dragon) => {
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
  updateTree((dragon: DragonType) => {
    if (!dragon.selected && condition(dragon)) dragon.selected = true;
  });
}
</script>

<style scoped lang="postcss">
.builder-container {
  align-items: stretch;
  flex-direction: column;
  display: flex;
  gap: 0.5rem;

  &:fullscreen {
    background: var(--dc-background);
    height: 100vh !important;
    width: 100vh !important;
    overflow: auto;
  }
}
</style>
