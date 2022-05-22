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
          :tree.sync="tree"
          :config="config" 
          @requestRemoveDescendants="replaceRoot"
          @requestAddDescendant="addDescendant"
          @contextmenu="() => false" />
    </div>
</template>

<script>
import { dragonBuilder, utils, backend } from '@/app/bundle.js';

import Toolbar from './Toolbar/Toolbar.vue';

import Lineage from '@/components/Lineage/Lineage';
import Information from '@/components/ui/Information';

const { forEveryDragon, countBreeds, countSelected } = utils;

export default {
  name: 'LineageBuilder',
  components: {
    Lineage,
    Information,
    Toolbar
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

  async mounted(){
    const hash = this.$route.query.template;

    if(hash === undefined){
      this.tree = dragonBuilder.createDragonProperties();
    }
    // the user has requested we import from an already built lineage.
    else{
      try {
        this.status ={
          level: 1,
          message: `Loading lineage... For big lineages, this can sometimes
          take a moment to load.`
        };

        const response = await backend.getLineageData(hash);

        const importedTree = JSON.parse(response.data.dragon);

        // add selection data
        forEveryDragon(importedTree, dragon => dragon.selected = false);

        this.tree = importedTree;
        this.status = { level: 0, message: "" };
        this.$store.dispatch('setUsedBreeds', countBreeds(this.tree));
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
    this.$store.dispatch('setUsedBreeds', []);
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
      this.$store.commit('resetSelectionCount', countSelected(node));

      // recalculate breed numbers
      this.$store.dispatch('setUsedBreeds', countBreeds(node))
  
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

      this.$store.dispatch('setUsedBreeds', countBreeds(this.tree));
    },

    selectionDeleteAncestors(){
      this.applyToSelected('parents', {});
      this.$store.commit('resetSelectionCount', countSelected(this.tree));
      this.$store.dispatch('setUsedBreeds', countBreeds(this.tree));
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

    selectionSwitchParents(){
      this.applyToSelected(async dragon => {
        const newParents = await dragonBuilder.switchParents(dragon, this.$store);
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
      this.$store.commit('resetSelectionCount');
    },

    selectBy(condition){
      let count = 0;
      forEveryDragon(this.tree, (dragon) => {
        if(!dragon.selected && condition(dragon)){
          dragon.selected = true;
          count++;
        }
      });
      
      this.$store.commit('upSelectionCount', count);
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