<template>
  <DialogBase
    :id="id"
    :open="open"
    @close="close"
  >
    <template #title>Import lineage</template>
    <FeedbackPanel
      ref="status"
      :global-settings="{ showDismiss: false }"
    />
    <div class="flex flex-col">
      <p>Paste the export text and click 'import'.</p>
      <p>
        If you have a lineage in progress, importing a new lineage will
        overwrite it.
      </p>
    </div>
    <InputTextbox
      v-model="file"
      autofocus
      placeholder="Paste your import text here"
      type="textarea"
    />
    <template #footer="{ dialog }">
      <button
        class="dialog-footer-button"
        @click="
          async () => {
            if (await importLineage()) {
              dialog.close();
            }
          }
        "
      >
        Import
      </button>
    </template>
  </DialogBase>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { PartialLineage } from '~/utils/shared/types';
import DialogBase from './BaseDialog.vue';
import InputTextbox from './InputTextbox.vue';
import FeedbackPanel from './FeedbackPanel.vue';
import { dragonSchema } from '~/utils/shared/validation.js';
import { Lineage } from '~/utils/shared/lineageHandler';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'onImport', tree: PartialLineage): void;
}>();

defineProps<{
  open: boolean;
  id: string;
}>();

const file = ref('');
const status = useTemplateRef('status');

function close() {
  file.value = '';
  status.value?.close();
  emit('close');
}

async function importLineage() {
  if (!status.value) return;

  try {
    const importedTree = (await dragonSchema
      .json()
      .validate(file.value)) as PartialLineage;
    emit('onImport', Lineage(importedTree).tree);
    return true;
  } catch {
    status.value.error(
      `Error reading export code. JSON is possibly malformed.`,
    );
  }

  return false;
}
</script>
