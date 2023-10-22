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
      <DragonFormattingBlock
        :dragon="problemDragon"
        :highlight="field"
        :error="error"
      />
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
import { onUpdated, ref } from 'vue';
import type { PropType } from 'vue';
import { ValidationError } from 'yup';
import { AxiosError } from 'axios';
import type {
  DragonType,
  MaybePartialLineageWithMetadata,
} from '../../app/types';
import { Lineage } from '../../app/lineageHandler';
import Dialog from './DialogBase.vue';
import Feedback from '../UI/Feedback.vue';
import Textbox from '../UI/Textbox.vue';
import DragonFormattingBlock from '../UI/DragonFormattingBlock.vue';

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

const field = ref();
const error = ref();
const isLoadedAndOk = ref(false);
const problemDragon = ref<DragonType>();
const status = ref<InstanceType<typeof Feedback>>();

const viewLink = ref('');

function reset() {
  isLoadedAndOk.value = false;
  problemDragon.value = undefined;
  viewLink.value = '';
}

onUpdated(async () => {
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
  } catch (e) {
    let message = '';

    if (e instanceof ValidationError) {
      field.value = e.type;
      error.value = e.message;

      if (e.type !== 'generation-count') {
        problemDragon.value = incomingTree
          .getAtPath((e.path as string).substring(0, e.path?.lastIndexOf('.')))
          ?.raw();
        message = 'The problem dragon is displayed below.';
      } else {
        message = e.message;
      }
    } else if (e instanceof AxiosError) {
      const { response } = e;

      message = `You may want to try again
            or export it instead.
            The error is: ${response?.status} ${response?.data}`;
    }

    status.value.error(
      `Sorry, an error has occurred while
            saving the lineage.<br /> ${message}`,
    );
  }
});
</script>
