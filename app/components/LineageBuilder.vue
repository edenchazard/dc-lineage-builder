<template>
  <div
    ref="builder"
    class="builder-container"
  >
    <Toolbar
      v-if="appStore.activeTree !== null"
      :config="config"
      :tree="appStore.activeTree"
      @update-config="
        (key: keyof LineageConfig, value: boolean) => (config[key] = value)
      "
      @import-tree="
        (newTree) =>
          (appStore.activeTree = LineageHandler(newTree).withMetadata())
      "
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
      class="builder"
      :root="appStore.activeTree"
      :config="config"
      @contextmenu="() => false"
    />
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-redeclare */
//todo fix @updateConfig="(key, value) => config[key] = value"
import { onMounted, reactive, ref } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useFullscreen } from '@vueuse/core';
import type {
  PartialLineageWithMetadata,
  DragonDisplay,
  LineageConfig,
} from '../shared/types';

import { hasParents } from '../app/utils';
import { getLineage } from '../app/api';
import { useAppStore } from '../store/useAppStore';
import Toolbar from './Toolbar.vue';
import Lineage from './Lineage.vue';
import Feedback from './Feedback.vue';
import { Lineage as LineageHandler } from '../shared/lineageHandler';
import { DragonBuilder } from '../shared/dragonBuilder';

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

  // the user has requested we import from a stored built lineage.
  if (hash !== undefined)
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
        return;
      }

      status.value.close(() => {
        appStore.activeTree = LineageHandler(response.data.lineage)
          .withMetadata()
          .raw();
      });
    } catch (ex: unknown) {
      if (ex instanceof Error) {
        status.value.error(ex.message);
      }
    }
});

// reset stuff on leave
// tree can be a large memory hog, and gc doesn't always get to it immediately.
onBeforeRouteLeave(() => {
  appStore.replaceRoot(DragonBuilder.createWithMetadata());
});

/**
 * Updates the tree
 * @param callback Callback to perform on each dragon node
 */
function updateTree(
  callback: (dragon: PartialLineageWithMetadata) => void,
): void {
  appStore.activeTree = appStore.activeLineage.every(callback);
}

// Accepts a callback
// Or a key and the value to change it to
function applyToSelected(
  callback: (dragon: PartialLineageWithMetadata) => void,
): void;
function applyToSelected(
  key: keyof PartialLineageWithMetadata,
  value: unknown,
): void;
function applyToSelected(
  keyOrCallback:
    | keyof PartialLineageWithMetadata
    | ((dragon: PartialLineageWithMetadata) => void),
  value?: unknown,
) {
  if (typeof keyOrCallback === 'string') {
    const key = keyOrCallback.toString();
    appStore.activeTree = appStore.activeLineage.every((dragon) => {
      if (dragon.selected && key in dragon) dragon[key] = value;
    });
  } else if (typeof keyOrCallback === 'function') {
    const callback = keyOrCallback;
    appStore.activeTree = appStore.activeLineage.every((dragon) => {
      if (dragon.selected) callback(dragon);
    });
  }
}

function selectionCriteria(
  callback: (dragon: PartialLineageWithMetadata) => boolean,
): void;
function selectionCriteria(
  key: keyof PartialLineageWithMetadata,
  value: unknown,
): void;
function selectionCriteria(
  keyOrCallback:
    | keyof PartialLineageWithMetadata
    | ((dragon: PartialLineageWithMetadata) => boolean),
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
        m: DragonBuilder.createWithMetadata({ gender: 'm' }),
        f: DragonBuilder.createWithMetadata({ gender: 'f' }),
      };
    }
  });
}

function selectionSwitchParents() {
  applyToSelected((dragon) => {
    // no parents, ignore
    if (!hasParents(dragon)) return;
    //dragon.parents = dragonBuilder.switchParents(dragon.parents);
  });
}

function selectionRandomizeLabels() {
  applyToSelected((dragon) => {
    if (dragon.display === 0) dragon.name = DragonBuilder.generateName();
    else dragon.code = DragonBuilder.generateCode();
  });
}

function selectionSwitchLabel(display: DragonDisplay) {
  applyToSelected('display', display);
}

function unselectAll() {
  applyToSelected('selected', false);
}

function selectBy(condition: (dragon: PartialLineageWithMetadata) => boolean) {
  updateTree((dragon: PartialLineageWithMetadata) => {
    if (!dragon.selected && condition(dragon)) dragon.selected = true;
  });
}
</script>

<style scoped lang="postcss">
.builder-container {
  align-items: stretch;
  flex-direction: column;
  display: flex;

  &:fullscreen {
    background: var(--dc-background);
    height: 100vh !important;
    width: 100vh !important;
    overflow: auto;
  }

  & > .builder {
    margin-top: 0.5rem;
  }
}
</style>
../shared/lineageHandler ../shared/dragonBuilder
