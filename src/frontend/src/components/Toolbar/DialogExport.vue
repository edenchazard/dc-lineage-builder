<template>
  <Dialog @close="emit('close')">
    <template #header> Export lineage </template>
    <template #body>
      <Feedback
        ref="status"
        :global-settings="{ showDismiss: false }"
      />
      <div v-if="!isError">
        <p>
          Copy and paste this text to a text file to import this lineage later.
        </p>
        <div>
          <Textbox
            v-model="file"
            placeholder="Export code"
            type="textarea"
            readonly
            :show-copy-button="true"
          />
        </div>
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
import { Lineage } from '../../app/lineageHandler';

import Dialog from '../UI/Dialog.vue';
import Feedback from '../UI/Feedback.vue';
import Textbox from '../UI/Textbox.vue';
import DragonFormattingBlock from '../UI/DragonFormattingBlock.vue';

const props = defineProps({
  tree: {
    type: Object as PropType<PartialLineageWithMetadata>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const file = ref('');
const isError = ref(false);
const problemDragon = ref<DragonType>();
const status = ref<InstanceType<typeof Feedback>>();

onMounted(() => {
  if (!status.value) return;

  // reset to false and change if we encounter problems later
  isError.value = false;

  const exportedTree = Lineage(props.tree).withoutMetadata();
  const { failed, failedTests, context } = verifyIntegrity(exportedTree);

  if (failed) {
    isError.value = true;

    if (context.failedDragon !== null) {
      problemDragon.value = context.failedDragon;
    }

    status.value.error(
      `Error creating export code. Tests failed: ${failedTests.join(', ')}`,
    );

    return;
  }

  file.value = JSON.stringify(exportedTree);
});
</script>
../../app/lineageHandler
