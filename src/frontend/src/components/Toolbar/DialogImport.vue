<template>
    <Dialog @close="emit('close')">
        <template v-slot:header>
          Import lineage
        </template>
        <template v-slot:body>
          <p>Paste the export text and click 'import'.</p>
          <p>Please note if you have a lineage in progress, importing a new lineage will overwrite it.</p>
          <div>
            <Textbox
              v-model="file"
              placeholder="Paste your import text here"
              type='textarea'/>
          </div>
          <Information :info="status" />
        </template>
        <template v-slot:footer>
          <button @click="importLineage">Import</button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';

import { verifyIntegrity } from '../../app/validators';
import { forEveryDragon } from "../../app/utils";
import { LineageRoot } from '../../app/types';

import Dialog from "../Dialog.vue";
import Textbox from '../ui/Textbox.vue';
import Information from "../ui/Information.vue";

const emit = defineEmits<{
    (e: "close"): void,
    (e: "onImport", tree: LineageRoot): void
}>();

const file = ref("");
const status = reactive({
  level: 0,
  message: ""
});

function importLineage(){
  try{
    const importedTree = JSON.parse(file.value.trim());
    const { failed, failedTests } = verifyIntegrity(importedTree);
  
    if(failed){
        Object.assign(status, {
          level: 3,
          message: `Error reading export code. Tests failed: ${failedTests.join(', ')}`
        });
        return;
    }

    // add selection data
    forEveryDragon(importedTree, dragon => dragon.selected = false);

    emit('onImport', importedTree);
    emit('close');
  }
  catch {
    Object.assign(status, {
      level: 3,
      message: `Error reading export code. JSON is possibly malformed.`
    });
  }
}
</script>