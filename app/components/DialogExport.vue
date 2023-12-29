<template>
  <BaseDialog
    :id="id"
    :open="open"
    @close="emit('close')"
  >
    <template #title> Export lineage </template>
    <template #default>
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
            select-all-on-focus
          />
        </div>
      </div>
      <div v-if="problemDragon">
        The problem dragon is:
        <DragonProblem :dragon="problemDragon" />
      </div>
    </template>
    <template #footer>
      <button
        class="dialog-footer-button"
        @click="emit('close')"
      >
        Close
      </button>
    </template>
  </BaseDialog>
</template>
<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import type { PropType } from 'vue';
import type {
  MaybePartialLineageWithMetadata,
  PartialLineage,
} from '../shared/types';
import BaseDialog from './BaseDialog.vue';
import Feedback from './Feedback.vue';
import Textbox from './Textbox.vue';
import DragonProblem from './DragonProblem.vue';
import { Lineage } from '../shared/lineageHandler';

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
    type: Object as PropType<MaybePartialLineageWithMetadata>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const file = ref('');
const isError = ref(false);
const problemDragon = ref<PartialLineage>();
const status = ref<InstanceType<typeof Feedback>>();

function reset() {
  isError.value = false;
}

onUpdated(async () => {
  if (!status.value) return;
  reset();

  try {
    file.value = JSON.stringify(Lineage(props.tree).withoutMetadata().raw());
  } catch (e) {
    status.value.error(
      `Sorry, an error has occurred while trying to export this lineage.`,
    );
  }
});
</script>
