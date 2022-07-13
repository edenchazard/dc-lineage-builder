<template>
    <Dialog @close="$emit('close')">
        <template v-slot:header>
          Import lineage
        </template>
        <template v-slot:body>
          <p>Paste the export text and click 'import'.</p>
          <p>Please note if you have a lineage in progress, importing a new lineage will overwrite it.</p>
          <div>
            <textarea v-model="file" placeholder="Paste your import text here" />
          </div>
          <Information :info="status" />
        </template>
        <template v-slot:footer>
          <button @click="importLineage">Import</button>
        </template>
    </Dialog>
</template>
<script>
import { verifyIntegrity } from '../../app/validators';
import { forEveryDragon } from "../../app/utils";

import Dialog from "../Dialog.vue";
import Information from "../ui/Information.vue";

export default {
  name: 'DialogImport',
  components: { Dialog, Information },
  props: {
      show: Boolean,
      tree: Object,
      onImport: Function
  },

  data(){
    return {
      file: "",
      status: {
        level: 0,
        message: ""
      },
    }
  },

  methods:{
    importLineage(){
      const errMsg = {
        level: 3,
        message: `Error reading export code. This export code could be corrupt or
        include a ghost breed that hasn't been re-uploaded.`
      };

      try{
        const importedTree = JSON.parse(this.file.trim());

        if(!verifyIntegrity(importedTree)){
          this.status = errMsg;
          return;
        }

        // add selection data
        forEveryDragon(importedTree, dragon => dragon.selected = false);

        this.$emit('onImport', importedTree);
        this.$emit('close');
      }
      catch{
          this.status = errMsg;
      }
    }
  }
};
</script>