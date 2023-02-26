<template>
  <Dialog @close="emit('close')">
    <template v-slot:header> Save lineage </template>
    <template v-slot:body>
      <Feedback
        ref="status"
        :globalSettings="{ showDismiss: false }"
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
          :showCopyButton="true"
        />
      </div>
    </template>
    <template v-slot:footer>
      <button @click="emit('close')">Close</button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import { verifyIntegrity, meetsSaveRequirements } from '../../app/validators';
import {
  createLineageLink,
  deepClone,
  forEveryDragon,
  makeError,
} from '../../app/utils';
import { saveLineage } from '../../app/api';

import Dialog from '../Dialog.vue';
import Feedback from '../ui/Feedback.vue';
import Textbox from '../ui/Textbox.vue';
import { LineageRoot } from '../../app/types';
import settings from '../../app/settings';

const props = defineProps({
  tree: {
    type: Object as PropType<LineageRoot>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isLoadedAndOk = ref(false);
const status = ref<InstanceType<typeof Feedback>>();

const viewLink = ref('');

onMounted(async () => {
  if (!status.value) return;

  // reset to false and change when ready
  isLoadedAndOk.value = false;

  // we do this conversion to discard any getters/setters/proxies
  const exportedTree = deepClone(props.tree);

  // @ts-ignore todo but doesn't affect runtime
  forEveryDragon(exportedTree, (dragon) => delete dragon.selected);

  // integrity check should never fail, but better to check anyway
  const integrity = verifyIntegrity(exportedTree);
  if (integrity.failed) {
    status.value.error(`Error reading lineage.<br />
        Integrity tests failed: ${makeError(integrity.failedTests)}`);
    return;
  }

  // make sure lineages fits our requirement for saving on the server
  const saveReqs = meetsSaveRequirements(exportedTree);
  if (saveReqs.failed) {
    status.value.error(`To save on the server, lineages must be between ${
      settings.gens.min
    }
            and ${
              settings.gens.max
            } generations long inclusively. There must also be
            no ghost breeds.<br />
            Save requirements failed: ${makeError(saveReqs.failedTests)}`);
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
