<template>
  <div
    v-if="tree !== null"
    class="lineage-builder">
    <Information :info="status" />
    <Toolbar
      :config="config"
      :tree="tree"
      @updateConfig="(key, value) => config[key] = value"
      @importTree="(newTree) => tree = newTree"
      @unselectAll="unselectAll"
      @changeBreed="selectionChangeBreed"
      @displayNames="selectionSwitchLabel(0)"
      @displayCodes="selectionSwitchLabel(1)"
      @selectCriteria="selectionCriteria"
      @randomizeLabels="selectionRandomizeLabels"
      @deleteAncestors="selectionDeleteAncestors"
      @addParents="selectionAddParents"
      @switchParents="selectionSwitchParents"
    />
    <Lineage
      class="builder"
      :root="tree"
      :config="config" 
      @requestRemoveDescendants="replaceRoot"
      @requestAddDescendant="addDescendant"
      @contextmenu="() => false" />
  </div>
</template>

<script lang="ts">
import * as dragonBuilder from "../app/dragonBuilder";
import { forEveryDragon, hasParents } from "../app/utils";
import { getLineageData } from "../app/api";
import { useAppStore } from "../store";
import { LineageRoot, DragonType, DragonDisplay } from "../app/types";

import Toolbar from './Toolbar/Toolbar.vue';
import Lineage from './Lineage/Lineage.vue';
import Information from './ui/Information.vue';
import { LineageConfig } from "../app/types";
import { defineComponent } from "vue";

interface State {
  tree: null | LineageRoot,
  config: LineageConfig,
  viewLink: string,
  status: {
    level: 0 | 1 | 2 | 3,
    message: string,
    title?: string
  }
}

export default defineComponent({
  name: 'LineageBuilder',
  components: {
    Lineage,
    Information,
    Toolbar
  },

  setup() {
    return { appStore: useAppStore() }
  },

  data(): State {
    return {
      tree: null,
      config: {
        showInterface: true,
        showLabels: true,
        disabled: false
      },
      viewLink: "",
      status: {
        level: 0,
        message: "",
        title: ""
      }
    }
  },

  watch: {
    tree: {
      deep: true,
      handler(){
        if(this.tree === null) return;

        const addToCountBreeds = (list: { [x: string]: number }, breed: string) =>
          list[breed] = list[breed] + 1 || 1;
    
        const breedCounts: {[x: string]: number} = {};
        let selected = 0;
    
        forEveryDragon(this.tree, (dragon) => {
          addToCountBreeds(breedCounts, dragon.breed);
          if(dragon.selected) selected++;
        });

        // exclude placeholders
        breedCounts['Placeholder'] && delete breedCounts['Placeholder'];

        this.appStore.setUsedBreeds(breedCounts);
        this.appStore.selectionCount = selected;
      }
    }
  },

  async mounted(){
    const hash = this.$route.query.template as string | undefined;

    if(hash === undefined){
      // No template, so start from scratch
      this.appStore.activeTree = dragonBuilder.createDragonProperties();
    }
    // the user has requested we import from an already built lineage.
    else{
      try {
        this.status ={
          level: 1,
          message: `Loading lineage... For big lineages, this can sometimes
          take a moment to load.`
        };

        // fetch from server
        const response = await getLineageData(hash);

        // parse response
        const savedTree = JSON.parse(response.data.dragon);

        // add selection data
        forEveryDragon(savedTree, dragon => dragon.selected = false);

        this.appStore.activeTree = savedTree;
        this.status = { level: 0, message: "" };
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
    }
  
    // store a reference to our active tree
    this.tree = this.appStore.activeTree;
  },

  // reset stuff
  // tree can be a large memory hog, and gc doesn't always get to it immediately.
  beforeDestroy(){
    this.tree = null;
  },

  methods: {
    addDescendant(){
      let newTree = dragonBuilder.createDragonProperties() as LineageRoot;

      // check current root if exists
      if(this.tree !== null){
        if(this.tree.gender === 'f'){
          newTree.parents = {
            f: this.tree,
            m: dragonBuilder.createDragonProperties({gender: 'm'})
          };
        }
        else{
          newTree.parents = {
            f: dragonBuilder.createDragonProperties({gender: 'f'}),
            m: this.tree
          };
        }
      }

      // replace the existing root with the new tree.
      this.tree = newTree;
    },

    replaceRoot(node: LineageRoot){
      // replace the tree
      this.tree = node;
    },

    // Accepts a callback
    // Or a key and the value to change it to
    applyToSelected(keyOrFunc: keyof DragonType | ((dragon: DragonType) => void), value?: any){
      if(typeof keyOrFunc === "string"){
        const key = keyOrFunc.toString();
        forEveryDragon(this.tree as LineageRoot, (dragon) => {
            if(dragon.selected) dragon[key] = value;
        });
      }
      else if(typeof keyOrFunc === "function"){
        const callback = keyOrFunc;
        forEveryDragon(this.tree as LineageRoot, (dragon) => {
            if(dragon.selected) callback(dragon);
        });
      }
    },

    selectionCriteria(criteria: keyof DragonType, value: DragonType[keyof DragonType]){
      const key = criteria.toString();
      this.selectBy((dragon) => dragon[key] === value);
    },

    async selectionChangeBreed(breedName: string){
      forEveryDragon(this.tree as LineageRoot, (dragon) => {
        if(dragon.selected) dragon.breed = breedName;
      });
    },

    selectionDeleteAncestors(){
      this.applyToSelected('parents', {});
    },

    selectionAddParents(){
      this.applyToSelected(dragon => {
        if(!hasParents(dragon)){
            dragon.parents = {
                m: dragonBuilder.createDragonProperties({gender: 'm'}),
                f: dragonBuilder.createDragonProperties({gender: 'f'})
            };
        }
      });
    },

    async selectionSwitchParents(){
      this.applyToSelected(dragon => {
        // no parents, ignore
        if(!hasParents(dragon)) return;
        const newParents = dragonBuilder.switchParents(dragon.parents);
        dragon.parents = newParents;
      });
    },

    selectionRandomizeLabels(){
      this.applyToSelected((dragon) => {
        if(dragon.display === 0) dragon.name = dragonBuilder.generateName();
        else dragon.code = dragonBuilder.generateCode();
      });
    },
  
    selectionSwitchLabel(display: DragonDisplay){
      this.applyToSelected('display', display);
    },
  
    unselectAll(){
      this.applyToSelected('selected', false);
    },

    selectBy(condition: ((dragon: DragonType) => boolean)){
      forEveryDragon(this.tree as LineageRoot, (dragon: DragonType) => {
        if(!dragon.selected && condition(dragon)) dragon.selected = true;
      });
    }
  }
});
</script>

<style scoped>
.builder{
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
    supported by Chrome, Edge, Opera and Firefox */
}
</style>