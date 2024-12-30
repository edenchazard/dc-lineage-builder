<template>
  <DialogBase
    :id="id"
    :open="open"
    @close="close"
  >
    <template #title>Import lineage</template>
    <Feedback
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
    <Textbox
      v-model="file"
      placeholder="Paste your import text here"
      type="textarea"
    />
    <template #footer>
      <button
        class="dialog-footer-button"
        @click="importLineage"
      >
        Import
      </button>
    </template>
  </DialogBase>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PartialLineage } from '../shared/types';
import DialogBase from './BaseDialog.vue';
import Textbox from './Textbox.vue';
import Feedback from './Feedback.vue';
import { dragonSchema } from '../shared/validation.js';
import { Lineage } from '../shared/lineageHandler';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'onImport', tree: PartialLineage): void;
}>();

defineProps<{
  open: boolean;
  id: string;
}>();

const file = ref('');
const status = ref<InstanceType<typeof Feedback>>();

function close() {
  file.value = '';
  emit('close');
}

async function importLineage() {
  if (!status.value) return;

  try {
    const importedTree = (await dragonSchema
      .json()
      .validate(file.value)) as PartialLineage;
    emit('onImport', Lineage(importedTree).tree);
    close();
  } catch {
    status.value.error(
      `Error reading export code. JSON is possibly malformed.`,
    );
  }
}
</script>
