<template>
  <Dialog
    :id="id"
    :open="open"
    @close="emit('close')"
  >
    <template #title> Import lineage </template>
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
    <template #footer>
      <button
        class="dialog-footer-button"
        @click="importLineage"
      >
        Import
      </button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import { verifyIntegrity } from '../../app/validators';
import { forEveryDragon, makeError } from '../../app/utils';
import { LineageRoot } from '../../app/types';

import Dialog from './DialogBase.vue';
import Textbox from '../UI/Textbox.vue';
import Feedback from '../UI/Feedback.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'onImport', tree: LineageRoot): void;
}>();

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const file = ref('');
const status = ref<InstanceType<typeof Feedback>>();

function importLineage() {
  if (!status.value) return;

  try {
    const importedTree = JSON.parse(file.value.trim());
    const { failed, failedTests } = verifyIntegrity(importedTree);

    if (failed) {
      status.value.error(
        `Error reading export code. Tests failed: ${makeError(failedTests)}`,
      );
      return;
    }

    // add selection data
    forEveryDragon(importedTree, (dragon) => (dragon.selected = false));

    emit('onImport', importedTree);
    emit('close');
  } catch {
    status.value.error(
      `Error reading export code. JSON is possibly malformed.`,
    );
  }
}
</script>
