<template>
  <Dialog @close="emit('close')">
    <template #header> Import lineage </template>
    <template #body>
      <Feedback
        ref="status"
        :global-settings="{ showDismiss: false }"
      />
      <p>Paste the export text and click 'import'.</p>
      <p>
        Please note if you have a lineage in progress, importing a new lineage
        will overwrite it.
      </p>
      <div>
        <Textbox
          v-model="file"
          placeholder="Paste your import text here"
          type="textarea"
        />
      </div>
    </template>
    <template #footer>
      <button @click="importLineage">Import</button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { PartialLineageWithMetadata } from '../../app/types';

import Dialog from '../UI/Dialog.vue';
import Textbox from '../UI/Textbox.vue';
import Feedback from '../UI/Feedback.vue';
import { Lineage } from '../../app/lineageHandler';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'onImport', tree: PartialLineageWithMetadata): void;
}>();

const file = ref('');
const status = ref<InstanceType<typeof Feedback>>();

function importLineage() {
  if (!status.value) return;

  try {
    const importedTree = Lineage(file.value, true);
    const { failed, failedTests } = verifyIntegrity(importedTree.raw());

    if (failed) {
      status.value.error(
        `Error reading export code. Tests failed: ${makeError(failedTests)}`,
      );
      return;
    }

    emit('onImport', importedTree.raw());
    emit('close');
  } catch {
    status.value.error(
      `Error reading export code. JSON is possibly malformed.`,
    );
  }
}
</script>
