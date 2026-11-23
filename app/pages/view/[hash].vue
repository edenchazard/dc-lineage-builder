<template>
  <h1 class="sr-only">Viewing lineage</h1>
  <div
    id="text"
    class="content-limit constrain-width"
  >
    <FeedbackPanel
      ref="status"
      :global-settings="{ showDismiss: false }"
    />
    <div
      v-if="tree != null"
      id="options"
    >
      <InputTextbox
        id="share-link"
        v-model="shareLink"
        type="input"
        show-copy-button
        show-share-button
        readonly
        select-all-on-focus
      />
      <NuxtLink
        rel="nofollow"
        :to="{
          path: '/',
          query: { template: hash },
        }"
        >Import into editor</NuxtLink
      >
    </div>
  </div>

  <LineageView
    v-if="tree != null"
    :root="tree"
    :config="config"
  />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, useTemplateRef } from 'vue';

import type {
  LineageConfig,
  PartialLineageWithMetadata,
} from '../../shared/types';
import { Lineage } from '../../shared/lineageHandler.js';
import { getLineage, isApiFetchError } from '../../app/api.js';
import { createLineageLink } from '../../shared/utils.js';

import LineageView from '../../components/LineageView.vue';
import InputTextbox from '../../components/InputTextbox.vue';
import FeedbackPanel from '../../components/FeedbackPanel.vue';

useSeoMeta({
  title: 'Viewing Lineage',
});

const route = useRoute();
const configRuntime = useRuntimeConfig();
const tree = ref<null | PartialLineageWithMetadata>(null);
const hash = route.params.hash as string;
const shareLink = createLineageLink(hash, configRuntime.app.baseURL);
const status = useTemplateRef('status');
const config = reactive<LineageConfig>({
  showInterface: false,
  showLabels: true,
  disabled: true,
});

onBeforeUnmount(() => (tree.value = null));

onMounted(async () => {
  if (!status.value) return;

  try {
    status.value.info(
      `Loading lineage... For big lineages, this can sometimes take a moment to load.`,
    );

    const response = await getLineage(hash);

    status.value.close(
      () => (tree.value = Lineage(response.lineage).withMetadata().raw()),
    );
  } catch (ex) {
    if (isApiFetchError(ex) && ex.response.status === 404) {
      status.value.error("The lineage couldn't be found.");
      return;
    }

    status.value.error('Sorry, an error has occurred.');
  }
});
</script>
<style scoped>
#text {
  margin-bottom: 0.5rem;
}

#options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

#share-link {
  flex: 1;
}
</style>
