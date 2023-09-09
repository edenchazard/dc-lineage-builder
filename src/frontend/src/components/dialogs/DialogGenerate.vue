<template>
  <Dialog
    :id="id"
    :open="open"
    @close="emit('close')"
  >
    <template #title>Save lineage</template>
    <Feedback
      ref="status"
      :global-settings="{ showDismiss: false }"
    />
    <div v-if="isLoadedAndOk">
      <p>
        To share this lineage with other people, copy and paste the link below.
      </p>
      <p>
        Please note if this link is not viewed in 2 months, it will be deleted
        from the server.
      </p>
      <Textbox
        v-model="viewLink"
        readonly
        type="input"
        placeholder="link"
        show-copy-button
        show-share-button
        select-all-on-focus
        copy-button-title="Copy lineage link"
        :share-params="{
          buttonTitle: 'Share lineage',
          title: 'View my lineage',
          text: 'View my DragCave lineage on Lineage Builder',
        }"
      />
    </div>
    <div v-else-if="problemDragon">
      The problem dragon is:
      <DragonFormattingBlock :dragon="problemDragon" />
    </div>
    <template #footer>
      <button
        class="dialog-footer-button"
        @click="emit('close')"
      >
        Close
      </button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { onMounted, onUpdated, PropType, ref, watch } from 'vue';
import { verifyIntegrity, meetsSaveRequirements } from '../../app/validators';
import { createLineageLink, forEveryDragon, makeError } from '../../app/utils';
import { saveLineage } from '../../app/api';
import Dialog from './DialogBase.vue';
import Feedback from '../UI/Feedback.vue';
import Textbox from '../UI/Textbox.vue';
import DragonFormattingBlock from '../UI/DragonFormattingBlock.vue';
import { DragonType, LineageRoot } from '../../app/types';
import settings from '../../app/settings';

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  tree: {
    type: Object as PropType<LineageRoot>,
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

watch(isLoadedAndOk, () => console.log(isLoadedAndOk.value));
watch(problemDragon, () => console.log(problemDragon.value));

onUpdated(async () => {
  if (!status.value) return;

  // reset to false and change when ready
  isLoadedAndOk.value = false;

  // todo but doesn't affect runtime
  // @ts-ignore
  const exportedTree = forEveryDragon(
    props.tree,
    (dragon) => delete dragon.selected,
  );

  // integrity check should never fail, but better to check anyway
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
