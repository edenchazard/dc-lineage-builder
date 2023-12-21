<template>
  <div>
    <div class="central-block">
      <div>
        <Feedback
          ref="status"
          :global-settings="{ showDismiss: false }"
        />
      </div>
      <div
        v-if="tree != null"
        id="options"
      >
        <span class="option">
          <router-link
            :to="{
              path: '/',
              query: { template: hash },
            }"
            >Import into editor</router-link
          >
        </span>
        <span class="option">
          Share link:
          <Textbox
            v-model="shareLink"
            type="input"
            :show-copy-button="true"
          />
        </span>
      </div>
    </div>
    <div v-if="tree != null">
      <Lineage
        :root="tree"
        :config="config"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type { LineageConfig, PartialLineage } from '../shared/types';
import { getLineage } from '../app/api';
import { createLineageLink } from '../app/utils';

import Lineage from '../components/Lineage.vue';
import Textbox from '../components/Textbox.vue';
import Feedback from '../components/Feedback.vue';

const route = useRoute();
const tree = ref<null | PartialLineage>(null);
const hash = route.params.hash as string;
const shareLink = createLineageLink(hash);
const status = ref<InstanceType<typeof Feedback>>();
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

    // fetch from server
    const response = await getLineage(hash);

    // errors
    if (response.errors.length > 0) {
      status.value.update(response.errors);
      return;
    }

    // ok
    status.value.close(() => {
      tree.value = response.data.lineage;
    });
  } catch (ex) {
    if (ex instanceof Error) status.value.error({ message: ex.message });
  }
});
</script>
<style scoped>
#options {
  margin: 15px 0px;
}
.option {
  margin: 5px 10px;
}
.share-link {
  width: 100%;
  max-width: 480px;
}
</style>
