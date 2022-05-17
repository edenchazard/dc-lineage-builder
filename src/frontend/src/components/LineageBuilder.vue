<template>
    <div class="lineage-builder">
      <Information :info="status" />
      <Toolbar
        :config="config"
        :tree="tree"
        @importTree="(newTree) => tree = newTree"
        @unselectAll="unselectAll"
        @changeBreed="selectionChangeBreeds"
        @displayNames="selectionSwitchLabel(0)"
        @displayCodes="selectionSwitchLabel(1)"
        @selectCriteria="selectionCriteria"
        @randomizeLabels="selectionRandomizeLabels"
      />
      <Lineage
        v-if="tree !== null"
          class="builder"
          :tree.sync="tree"
          :config="config" 
          @requestRemoveDescendants="replaceRoot"
          @requestAddDescendant="addDescendant"
          @contextmenu.prevent />
    </div>
</template>

<script>
import { dragonBuilder, utils, backend } from '@/app/bundle.js';

import Toolbar from './Toolbar/Toolbar.vue';

import Lineage from '@/components/Lineage/Lineage';
import Information from '@/components/ui/Information';

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
    },

    selectBy(condition){
      const a = performance.now();
      let count = 0;
      utils.forEveryDragon(this.tree, async (dragon) => {
        if(!dragon.selected && condition(dragon)){
          dragon.selected = true;
          count++;
        }
      });
      
      this.$store.commit('upSelectionCount', count);
      console.log('time2', a - performance.now())
    },

    // Accepts a callback
    // Or a key and the value to change it to
    applyToSelected(prop, value){
      const a = performance.now();

      const isAttribute = typeof prop === "string";
    
      utils.forEveryDragon(this.tree, async (dragon) => {
        if(dragon.selected){
          if(isAttribute){
            dragon[prop] = value;
          }
          else{
            prop(dragon);
          }
        }
      });
  
      console.log('time2', a - performance.now())
    },

    selectionCriteria(criteria){
      switch(criteria){
        case 'male':
          this.selectBy((dragon) => dragon.gender === 'm');
          break;
        case 'female':
          this.selectBy((dragon) => dragon.gender === 'f');
          break;
        case 'name':
          this.selectBy((dragon) => dragon.display === 0);
          break;
        case 'code':
          this.selectBy((dragon) => dragon.display === 1);
          break;
        case 'placeholder':
          this.selectBy((dragon) => dragon.breed === "Placeholder");
          break;
      }
    },

    async selectionChangeBreeds(breedName){
      utils.forEveryDragon(this.tree, async (dragon) => {
        if(dragon.selected){
          dragon.breed = breedName;
        }
      });

      // update used breeds count with new count
      this.$store.dispatch('setUsedBreeds', utils.countBreeds(this.tree));
  
      ///await this.$store.dispatch('addToUsedBreeds', breedName, this.$store.state.selectionCount);
    },
    selectionRandomizeLabels(){
      this.applyToSelected((dragon) => {
        // randomize name
        if(dragon.display === 0){
          dragon.name = dragonBuilder.generateName();
        }
        // randomize code
        else{
          dragon.code = dragonBuilder.generateCode();
        }
      })
    },
  
    selectionSwitchLabel(display){
      this.applyToSelected('display', display);
    },
  
    unselectAll(){
      utils.forEveryDragon(this.tree, dragon => dragon.selected = false);
      this.$store.commit('resetSelectionCount');
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