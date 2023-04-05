<template>
  <Dialog @close="emit('close')">
    <template v-slot:header> Export lineage </template>
    <template v-slot:body>
      <Feedback
        ref="status"
        :globalSettings="{ showDismiss: false }"
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
            :showCopyButton="true"
          />
        </div>
      </div>
      <div v-if="problemDragon">
        The problem dragon is:
        <DragonFormattingBlock :dragon="problemDragon" />
      </div>
    </template>
    <template v-slot:footer>
      <button @click="emit('close')">Close</button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import { DragonType, LineageRoot } from '../../app/types';
import { deepClone, forEveryDragon } from '../../app/utils';
import { verifyIntegrity } from '../../app/validators';

import Dialog from '../UI/Dialog.vue';
import Feedback from '../UI/Feedback.vue';
import Textbox from '../UI/Textbox.vue';
import DragonFormattingBlock from '../UI/DragonFormattingBlock.vue';

const props = defineProps({
  tree: {
    type: Object as PropType<LineageRoot>,
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

  // we do this conversion to discard any getters/setters/proxies
  const exportedTree = deepClone(props.tree);

  // todo but doesn't affect runtime
  // @ts-ignore
  forEveryDragon(exportedTree, (dragon) => delete dragon.selected);

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
