<template>
  <Dialog @close="emit('close')">
    <template #header> Save lineage </template>
    <template #body>
      <Feedback
        ref="status"
        :global-settings="{ showDismiss: false }"
      />
      <div v-if="isLoadedAndOk">
        <p>
          To share this lineage with other people, copy and paste the link
          below.
        </p>
        <p>
          Please note if this link is not viewed in 2 months, it will be deleted
          from the server.
        </p>
        <Textbox
          v-model="viewLink"
          type="input"
          placeholder="link"
          :show-copy-button="true"
        />
      </div>
      <div v-if="problemDragon">
        The problem dragon is:
        <DragonFormattingBlock :dragon="problemDragon" />
      </div>
    </template>
    <template #footer>
      <button @click="emit('close')">Close</button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { PropType } from 'vue';
import type { DragonType, PartialLineageWithMetadata } from '../../app/types';
import { createLineageLink, makeError } from '../../app/utils';
import { saveLineage } from '../../app/api';

import Dialog from '../UI/Dialog.vue';
import Feedback from '../UI/Feedback.vue';
import Textbox from '../UI/Textbox.vue';
import DragonFormattingBlock from '../UI/DragonFormattingBlock.vue';
import settings from '../../app/settings';
import { Lineage } from '../../app/lineageHandler';

const props = defineProps({
  tree: {
    type: Object as PropType<PartialLineageWithMetadata>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isLoadedAndOk = ref(false);
const problemDragon = ref<DragonType>();
const status = ref<InstanceType<typeof Feedback>>();

const viewLink = ref('');

onMounted(async () => {
  if (!status.value) return;

  // reset to false and change when ready
  isLoadedAndOk.value = false;

  // todo but doesn't affect runtime
  const exportedTree = Lineage(props.tree).withoutMetadata();

  // integrity check should never fail, but best to check anyway
  const integrity = verifyIntegrity(exportedTree);

  if (integrity.failed) {
    status.value.error(`Error saving lineage.<br />
        Integrity tests failed: ${makeError(integrity.failedTests)}`);
    if (integrity.context.failedDragon !== null) {
      problemDragon.value = integrity.context.failedDragon;
    }
    return;
  }

  // make sure lineages fits our requirement for saving on the server
  const saveReqs = meetsSaveRequirements(exportedTree);
  if (saveReqs.failed) {
    status.value.error(`To save on the server, lineages must be between
    ${settings.gens.min} and ${
      settings.gens.max
    } generations long inclusively. There must also be no ghost breeds.<br /> Save requirements failed: ${makeError(
      saveReqs.failedTests,
    )}`);
    if (saveReqs.context.failedDragon !== null) {
      problemDragon.value = saveReqs.context.failedDragon;
    }
    return;
  }

  try {
    status.value.info('Saving lineage and generating link...');
    const response = await saveLineage(exportedTree);
    status.value.close(() => {
      isLoadedAndOk.value = true;
      viewLink.value = createLineageLink(response.data.hash);
    });
  } catch (error) {
    const { response } = error;
    status.value.error(`Sorry, an error has occurred while
            saving the lineage. You may want to try again
            or export it instead.
            The error is: ${response.status} ${response.data}`);
  }
});
</script>
../../app/lineageHandler
