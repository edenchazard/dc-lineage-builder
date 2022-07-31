<template>
    <div>
        <DialogExport
            v-if="showExportDialog"
            :tree="tree"
            @close="showExportDialog = false" />

        <div class='central-block'>
            <section>
                <h2>Checker Generator</h2>
                <p>On this page you can build checkers quickly. Simply select the male breed (top), the female breed (bottom) and how many generations you want it to be. You can then export it and import it for use with the editor.</p>
            </section>
            <section id='checker-controls'>
                <div class='left'>
                    <div class='applied-tags'>
                        <label>Groups:</label>
                        <BreedGroupsTagSelector />
                    </div>
                    <div class='applied-tags'>
                        <label>Showing:</label>
                        <BreedTagsSelector />
                    </div>
                    <div>
                        <label for="search">Search: </label>
                        <input
                            id='search'
                            type='search'
                            v-model="query"
                            placeholder="Search breeds" />
                    </div>
                </div>
                <div class='right'>
                    <div>
                        <label for="generations">Generations: </label>
                        <select
                            id='generations'
                            title="Generations"
                            v-model="genCount"
                            @change="updateTree">
                            <option
                                v-for="index in 6"
                                :value="(index+1)"
                                :key='index'>{{(index + 1)}}
                            </option>
                        </select>
                    </div>
                    <div>
                        <button class='themed-button' @click="showExportDialog = true">
                            <font-awesome-icon icon="save" /> Export
                        </button>
                    </div>
                </div>
            </section>
            <section id='breeds'>
                <div>
                    <label>Male breed</label>
                    <BreedDropdownResults
                        :search="query"
                        :breeds="maleBreeds"
                        :tags="$store.getters.enabledTags"
                        :groups="$store.getters.enabledGroups"
                        @selected="selectMale"
                        class='results' />
                </div>
                <div>
                    <label>Female breed</label>
                    <BreedDropdownResults
                        :search="query"
                        :breeds="femaleBreeds"
                        :tags="$store.getters.enabledTags"
                        :groups="$store.getters.enabledGroups"
                        @selected="selectFemale"
                        class='results' />
                </div>
            </section>
        </div>
        <section>
            <Lineage
                v-if="tree !== null"
                :tree.sync="tree"
                :config="{showInterface: false, showLabels: true, disabled: true}" />
        </section>
    </div>
</template>

<script>
import GLOBALS from '../app/globals';
import { createDragonProperties } from '../app/dragonBuilder';

import Lineage from "../components/Lineage/Lineage.vue";
import BreedDropdownResults from "../components/BreedDropdownResults.vue";
import DialogExport from "../components/Toolbar/DialogExport.vue";
import BreedTagsSelector from '../components/BreedTagsSelector.vue';
import BreedGroupsTagSelector from '../components/BreedGroupsTagSelector.vue';

export default {
    name: 'PageCheckerGen',
    components: {
        Lineage,
        BreedDropdownResults,
        DialogExport,
        BreedTagsSelector,
        BreedGroupsTagSelector
    },

    data() {
        return {
            tree: createDragonProperties(),
            maleBreed: "Placeholder",
            maleBreeds: GLOBALS.breeds.males,
            femaleBreed: "Placeholder",
            femaleBreeds: GLOBALS.breeds.females,
            genCount: 2,
            query: "",
            showExportDialog: false,
        }
    },
    methods: {
        selectMale(breed){
            this.maleBreed = breed.name;
            this.updateTree('m');
        },

        selectFemale(breed){
            this.femaleBreed = breed.name;
            this.updateTree('f');
        },

        updateTree(finalGenGender){
            let createParents = (n) => {
                let branch ={
                    m: createDragonProperties({
                        gender: 'm',
                        breed: this.maleBreed
                    }),
                    f: createDragonProperties({
                        gender: 'f',
                        breed: this.femaleBreed
                    })
                };

                if(n < this.genCount){
                    branch.m.parents = createParents(n + 1);
                    branch.f.parents = createParents(n + 1);
                }
                return branch;
            };

            // The breed and gender of the final dragon (meaning) the highest gen
            // should always be the last selected
            let options = { gender: 'm', breed: this.maleBreed };
            if(finalGenGender === 'f'){
                options = { gender: 'f', breed: this.femaleBreed };
            }
            let final = createDragonProperties({
                ...options,
                parents: createParents(2)
            });

            // update our tree
            this.tree = final;
        }
    }
}
</script>
<style scoped>
#checker-controls{
    display:flex;
    flex-direction: column;
}
#checker-controls .left > div{
    margin-bottom:5px;
}
#breeds{
    display: flex;
    margin-bottom:10px;
}
#breeds > div{
    width:100%;
    text-align:center;
}
.breed-list{
    overflow:auto;
    height:300px;
}
label{
    font-weight:bold;
}
.results{
    height:30vh;
}
.applied-tags{
    display: flex;
    align-items: center;
}
.right{
    display: flex;
    flex-direction: column
}

@media only screen and (min-width: 700px){
    #checker-controls{
        flex-direction: row;
    }
    .right{
        margin-left: 10px;
    }
}
</style>