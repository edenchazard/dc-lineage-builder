<template>
  <div
    ref="builder"
    class="builder-container"
  >
    <DialogBreedSelector />
    <div class="constrain-width">
      <FeedbackPanel ref="status" />
    </div>
    <LineageView
      v-if="appStore.activeTree !== null"
      class="builder"
      :root="appStore.activeTree"
      :config="config"
      @contextmenu="() => false"
    />
    <LineageBuilderToolbar
      v-if="appStore.activeTree !== null"
      :config="config"
      :tree="appStore.activeTree"
      @update-config="(key, value) => (config[key] = value)"
      @import-tree="
        (newTree) =>
          (appStore.activeTree = LineageHandler(newTree).withMetadata().tree)
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useFullscreen } from '@vueuse/core';
import { getLineage } from '~/composables/useAPI';
import LineageBuilderToolbar from './LineageBuilderToolbar.vue';
import LineageView from './LineageView.vue';
import FeedbackPanel from './FeedbackPanel.vue';
import { FetchError } from 'ofetch';
import type {
  DragonDisplay,
  LineageConfig,
  PartialLineageWithMetadata,
} from '~~/shared/types';
import { LineageHandler } from '~~/shared/lineageHandler';
import { DragonBuilder } from '~~/shared/dragonBuilder';
import { hasParents } from '~~/shared/utils';

const route = useRoute();
const appStore = useAppStore();
const builder = ref(null);
const fullscreen = useFullscreen(builder);
const config = reactive<LineageConfig>({
  showInterface: true,
  showLabels: true,
  disabled: false,
});
const status = useTemplateRef('status');

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
      const response = await getLineage(hash);

      status.value.close(() => {
        appStore.activeTree = LineageHandler(response.lineage)
          .withMetadata()
          .raw();
      });
    } catch (ex) {
      if (ex instanceof FetchError && ex.response?.status === 404) {
        status.value.error("The lineage couldn't be found.");
        return;
      }

      status.value.error('Sorry, an error has occurred.');
    }
});

// The tree can be a memory hog. Additionally, the user might have navigated
// away from the page by accident. We'll keep the lineage, but clear
// the history to save memory.
onBeforeRouteLeave(() => {
  appStore.treeHistory.clear();
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
    if (!hasParents(dragon)) return;

    Object.assign(dragon, LineageHandler(dragon).switchParents().raw());
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

<style scoped>
.builder-container {
  align-items: stretch;
  flex-direction: column;
  display: flex;

  &:fullscreen {
    height: 100vh !important;
    width: 100vh !important;
    overflow: auto;
  }
}
</style>
