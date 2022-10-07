<template>
    <div class="lineage-builder">
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
        v-if="tree !== null"
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
import { forEveryDragon } from "../app/utils";
import { getLineageData } from "../app/api";
import { useAppStore } from "../store"

import Toolbar from './Toolbar/Toolbar.vue';
import Lineage from './Lineage/Lineage.vue';
import Information from './ui/Information.vue';

export default {
  name: 'LineageBuilder',
  components: {
    Lineage,
    Information,
    Toolbar
  },

  setup() {
      return { appStore: useAppStore() }
  },

  data() {
    return {
      tree: null,
      config:{
        strict: false,
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
        //const a = performance.now();
        // count breeds in the tree recursively
        // accepts an array of trees
        const addToCountBreeds = (list, breed) => {
          list[breed] = list[breed] + 1 || 1;
        };
      
        const breeds = {};
        let selected = 0;
    
        forEveryDragon(this.tree, (dragon) => {
          addToCountBreeds(breeds, dragon.breed);
          if(dragon.selected){
            selected++;
          }
        });

        // exclude placeholders
        breeds['Placeholder'] && delete breeds['Placeholder'];

        this.appStore.setUsedBreeds(breeds);
        this.appStore.setSelectionCount(selected);
        //console.log(performance.now() - a)
      }
    }
  },

  async mounted(){
    const hash = this.$route.query.template;

    if(hash === undefined){
      // set the active tree
      this.appStore.activeTree = dragonBuilder.createDragonProperties();

      // store a reference to our active tree
      this.tree = this.appStore.activeTree;
    }
    // the user has requested we import from an already built lineage.
    else{
      try {
        this.status ={
          level: 1,
          message: `Loading lineage... For big lineages, this can sometimes
          take a moment to load.`
        };

        const response = await getLineageData(hash);

        const importedTree = JSON.parse(response.data.dragon);

        // add selection data
        forEveryDragon(importedTree, dragon => dragon.selected = false);

        this.tree = importedTree;
        this.status = { level: 0, message: "" };
        //this.$store.dispatch('setUsedBreeds', countBreeds(this.tree));
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
  },

  // reset stuff
  // tree can be a large memory hog, and gc doesn't always get to it immediately.
  beforeDestroy(){
    this.tree = null;
    //this.$store.dispatch('setUsedBreeds', []);
  },

  methods: {
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
      // recalculate selected count
      //this.$store.commit('resetSelectionCount', countSelected(node));

      // recalculate breed numbers
      //this.$store.dispatch('setUsedBreeds', countBreeds(node))
  
      // replace the tree
      this.tree = node;
    },

    // Accepts a callback
    // Or a key and the value to change it to
    applyToSelected(prop, value){
      const isAttribute = typeof prop === "string";
    
      forEveryDragon(this.tree, async (dragon) => {
        if(dragon.selected){
          if(isAttribute){
            dragon[prop] = value;
          }
          else{
            prop(dragon);
          }
        }
      });
    },

    selectionCriteria(criteria, value){
      this.selectBy((dragon) => dragon[criteria] === value);
    },

    async selectionChangeBreed(breedName){
      forEveryDragon(this.tree, (dragon) => {
        if(dragon.selected){
          dragon.breed = breedName;
        }
      });

      //this.$store.dispatch('setUsedBreeds', countBreeds(this.tree));
    },

    selectionDeleteAncestors(){
      this.applyToSelected('parents', {});
      //this.$store.commit('resetSelectionCount', countSelected(this.tree));
      //this.$store.dispatch('setUsedBreeds', countBreeds(this.tree));
    },

    selectionAddParents(){
      this.applyToSelected(dragon => {
        if(!('f' in dragon.parents)){
            const parents ={
                m: dragonBuilder.createDragonProperties({gender: 'm'}),
                f: dragonBuilder.createDragonProperties({gender: 'f'})
            };
            dragon.parents = parents;
        }
      });
    },

    async selectionSwitchParents(){
      this.applyToSelected(dragon => {
        // no parents, ignore
        if(!('f' in dragon.parents)){
          return;
        }
        const newParents = dragonBuilder.switchParents(dragon);
        dragon.parents = newParents;
      });
    },

    selectionRandomizeLabels(){
      this.applyToSelected((dragon) => {
        if(dragon.display === 0){
          dragon.name = dragonBuilder.generateName();
        }
        else{
          dragon.code = dragonBuilder.generateCode();
        }
      });
    },
  
    selectionSwitchLabel(display){
      this.applyToSelected('display', display);
    },
  
    unselectAll(){
      this.applyToSelected('selected', false);
      //this.$store.commit('resetSelectionCount');
    },

    selectBy(condition){
      forEveryDragon(this.tree, (dragon) => {
        if(!dragon.selected && condition(dragon)){
          dragon.selected = true;
        }
      });
      
      //this.$store.commit('upSelectionCount', count);
    }
  }
}
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