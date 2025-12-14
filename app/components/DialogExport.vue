<template>
  <BaseDialog
    :id="id"
    :open="open"
    @close="emit('close')"
  >
    <template #title> Export lineage </template>
    <FeedbackPanel
      ref="status"
      :global-settings="{ showDismiss: false }"
    />
    <div
      v-if="!isError"
      class="flex flex-col"
    >
      <p>
        Copy and paste this text to a text file to import this lineage later.
      </p>
      <InputTextbox
        v-model="file"
        autofocus
        placeholder="Export code"
        type="textarea"
        readonly
        :show-copy-button="true"
        select-all-on-focus
      />
    </div>
    <div v-if="problemDragon">
      The problem dragon is:
      <DragonProblem :dragon="problemDragon" />
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import BaseDialog from './BaseDialog.vue';
import FeedbackPanel from './FeedbackPanel.vue';
import InputTextbox from './InputTextbox.vue';
import DragonProblem from './DragonProblem.vue';
import type {
  MaybePartialLineageWithMetadata,
  PartialLineage,
} from '~~/shared/types';
import { Lineage } from '~~/shared/lineageHandler';

const props = defineProps<{
  open: boolean;
  id: string;
  tree: MaybePartialLineageWithMetadata;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const file = ref('');
const isError = ref(false);
const problemDragon = ref<PartialLineage>();
const status = useTemplateRef('status');

function reset() {
  isError.value = false;
}

watch(
  () => props.open,
  () => {
    if (!status.value) return;
    reset();

    try {
      file.value = JSON.stringify(Lineage(props.tree).withoutMetadata().raw());
    } catch (_) {
      status.value.error(
        `Sorry, an error has occurred while trying to export this lineage.`,
      );
    }
  },
);
</script>
