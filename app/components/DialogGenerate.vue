<template>
  <BaseDialog
    :id="id"
    :open="open"
    @close="emit('close')"
  >
    <template #title>Save lineage</template>
    <FeedbackPanel
      ref="status"
      :global-settings="{ showDismiss: false }"
    />
    <div
      v-if="isLoadedAndOk"
      class="flex flex-col"
    >
      <p>
        To share this lineage with other people, copy and paste the link below.
      </p>
      <p>
        Please note if this link is not viewed in 2 months, it will be deleted
        from the server.
      </p>
      <InputTextbox
        v-model="viewLink"
        autofocus
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
      <DragonProblem
        :dragon="problemDragon"
        :highlight="field"
        :error="error"
      />
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import { ValidationError } from 'yup';
import BaseDialog from './BaseDialog.vue';
import FeedbackPanel from './FeedbackPanel.vue';
import InputTextbox from './InputTextbox.vue';
import DragonProblem from './DragonProblem.vue';
import type {
  MaybePartialLineageWithMetadata,
  PartialLineage,
} from '~~/shared/types';
import { Lineage } from '~~/shared/lineageHandler';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  open: boolean;
  id: string;
  tree: MaybePartialLineageWithMetadata;
}>();

const field = ref();
const error = ref();
const isLoadedAndOk = ref(false);
const problemDragon = ref<PartialLineage>();
const viewLink = ref('');
const status = useTemplateRef('status');

function reset() {
  isLoadedAndOk.value = false;
  problemDragon.value = undefined;
  viewLink.value = '';
}

watch(
  () => props.open,
  async () => {
    if (!status.value) return;

    reset();

    const incomingTree = Lineage(props.tree);

    try {
      status.value.info('Attempting to save lineage...');

      const link = await incomingTree.saveToServer();

      status.value.close(() => {
        isLoadedAndOk.value = true;
        viewLink.value = link;
      });
    } catch (ex) {
      const message = (() => {
        if (ex instanceof ValidationError) {
          field.value = ex.type;
          error.value = ex.message;

          if (ex.type !== 'generation-count') {
            problemDragon.value = incomingTree
              .getAtPath(
                (ex.path as string).substring(0, ex.path?.lastIndexOf('.')),
              )
              ?.raw();
            return 'The problem dragon is displayed below.';
          }
          return ex.message;
        }
        return `You may want to try again or export it instead.`;
      })();

      status.value.error(
        `Sorry, an error has occurred while
            saving the lineage.<br /> ${message}`,
      );
    }
  },
);
</script>
