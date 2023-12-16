<template>
  <Dialog
    :id="id"
    :open="open"
    @close="close"
  >
    <template #title> Import lineage </template>
    <Feedback
      ref="status"
      :global-settings="{ showDismiss: false }"
    />
    <p>Paste the export text and click 'import'.</p>
    <p>
      If you have a lineage in progress, importing a new lineage will overwrite
      it.
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
import type { PartialLineage } from '../shared/types';
import Dialog from './DialogBase.vue';
import Textbox from './Textbox.vue';
import Feedback from './Feedback.vue';
import { dragonSchema } from '../shared/validation';
import { Lineage } from '../shared/lineageHandler';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'onImport', tree: PartialLineage): void;
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
    console.log(importedTree);
    emit('onImport', Lineage(importedTree).tree);
    close();
  } catch {
    status.value.error(
      `Error reading export code. JSON is possibly malformed.`,
    );
  }
}
</script>
