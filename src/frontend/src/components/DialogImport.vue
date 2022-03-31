<template>
    <Dialog
        v-show="show"
        @close="$emit('close')">
        <template v-slot:header>
          Import lineage
        </template>
        <template v-slot:body>
          <p>Paste the export text and click 'import'.</p>
          <p>Please note if you have a lineage in progress, importing a new lineage will overwrite it.</p>
          <div>
            <TextCopy v-model="file" placeholder="Paste your import text here" />
          </div>
          <Information :info="status" />
        </template>
        <template v-slot:footer>
          <button @click="importLineage">Import</button>
        </template>
    </Dialog>
</template>
<script>
import Dialog from '@/components/Dialog';
import { validators } from '@/app/bundle.js';
import Information from '@/components/ui/Information';
import TextCopy from '@/components/ui/TextCopy';

export default {
  name: 'DialogImport',
  components: { Dialog, Information, TextCopy },
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

  // put our stuff in a watcher because we don't want to re-evaluate the tree
  // every time it changes, only when the dialog is shown
  watch:{
      'show'(){
          this.status = { level: 0, message: "" };
          this.file = "";
      },
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
        if(!validators.verifyIntegrity(importedTree)){
          this.status = errMsg;
          return;
        }

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