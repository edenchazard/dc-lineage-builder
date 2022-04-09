<template>
    <div class="lineage-builder">
      <Information :info="status" />
      <DialogExport :show="showExportDialog" :tree="tree" @close="showExportDialog = false" />
      <DialogImport :show="showImportDialog" @close="showImportDialog = false" @onImport="importLineage" />
      <DialogGenerate :show="showGenerateDialog" :tree='tree' @close="showGenerateDialog = false" />

      <div class='toolbar'>
        <div class='toolbar-item'>
          <toggle-button v-model="config.showInterface" color="var(--builderControlBG)" />
          <span>Show interface</span>
        </div>
        <div class='toolbar-item'>
          <toggle-button v-model="config.showLabels" color="var(--builderControlBG)" />
          <span>Show labels</span>
        </div>
        <div class='toolbar-item'>
          <button @click="showExportDialog = true">
            <font-awesome-icon icon="save" /> Export
          </button>
          <br />
          <button @click="showImportDialog = true">
            <font-awesome-icon icon="file-code" /> Import
          </button>
        </div>
        <div class='toolbar-item'>
          <button @click="showGenerateDialog = true">
            <font-awesome-icon icon="link" /> Get Link
          </button>
        </div>
      </div>
      <Lineage
        class="builder"
        v-if="tree !== null"
        :tree.sync="tree"
        :config="config" 
        @requestRemoveDescendants="replaceRoot"
        @requestAddDescendant="addDescendant" />
    </div>
</template>

<script>
import { dragonBuilder, utils, backend } from '@/app/bundle.js';
import { ToggleButton } from 'vue-js-toggle-button';
import Lineage from '@/components/Lineage';
import DialogExport from '@/components/DialogExport';
import DialogImport from '@/components/DialogImport';
import DialogGenerate from '@/components/DialogGenerate';
import Information from '@/components/ui/Information';

export default {
  name: 'LineageBuilder',
  components: { ToggleButton,Lineage, DialogExport, DialogImport, DialogGenerate,
                Information },

  data() {
    return {
      tree: null,
      config:{
        strict: false,
        showInterface: true,
        showLabels: true,
        disabled: false
      },
      showImportDialog: false,
      showExportDialog: false,
      showGenerateDialog: false,
      viewLink: "",
      categories: [
        {id: 1, name: "Dragon"},
        {id: 2, name: "Pygmy"},
        {id: 3, name: "Two-head"}
      ],
      status: {
        level: 0,
        message: "",
        title: ""
      }
    }
  },

  mounted(){
    const hash = this.$route.query.template;

    if(hash === undefined){
      this.tree = dragonBuilder.createDragonProperties();
    }
    // the user has requested we import from an already built lineage.
    else{
      (async() => {
        try {
          this.status ={
            level: 1,
            message: `Loading lineage... For big lineages, this can sometimes
            take a moment to load.`
          };
          const response = await backend.getLineageData(hash);
          this.tree = JSON.parse(response.data.dragon);
          this.status = { level: 0, message: "" };
          this.$store.dispatch('setUsedBreeds', utils.countBreeds(this.tree));
        }
        catch (error) {
          const { response } = error;
          this.status = {
            level: 3,
            title: `${response.status} ${response.statusText}`,
            message: `Sorry, an error has occurred while loading the lineage.
            The error is: ${response.status} ${response.data}`
          };
        }
      })();
    }
  },

  // reset stuff
  // tree can be a large memory hog, and gc doesn't always get to it immediately.
  beforeDestroy(){
    this.tree = null;
    this.$store.dispatch('setUsedBreeds', []);
  },

  methods: {
    importLineage(tree){
      this.tree = tree;
      this.$store.dispatch('setUsedBreeds', utils.countBreeds(tree));
    },

    
    addDescendant(){
      let newTree = dragonBuilder.createDragonProperties();

      // check current root
      if(this.tree.gender === 'f'){
        newTree.parents.f = this.tree;
        newTree.parents.m = dragonBuilder.createDragonProperties({gender: 'm'});
      }
      else{
        newTree.parents.f = dragonBuilder.createDragonProperties({gender: 'f'});
        newTree.parents.m = this.tree;
      }

      // replace the existing root with the new tree.
      this.tree = newTree;
    },

    replaceRoot(node){
      this.$store.dispatch('setUsedBreeds', utils.countBreeds(node));
      this.tree = node;
    }
  }
}
</script>

<style scoped>
.builder{
  width: calc(100% - 19px);
}
.toolbar{
  margin:20px auto;
  max-width: 800px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
}
.toolbar-item{
  margin: 5px;
  text-align: center;
}
.toolbar-item span{
  margin: 5px;
}
.toolbar-item button{
  margin:2px 0px;
  cursor: pointer;
  padding: 8px;
  color:var(--builderControlFG);
  background: var(--builderControlBG);
  border:none;
  width:100%;
}

@media only screen and (min-width: 768px) {
  .toolbar {
    padding: 0px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
</style>