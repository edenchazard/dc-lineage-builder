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
                    <div>
                        <label for="filter">Filter: </label>
                        <input
                            id='filter'
                            type='search'
                            v-model="query"
                            placeholder="Search breeds" />
                    </div>
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
                </div>
                <div class='right'>
                    <button class='themed-button' @click="showExportDialog = true">
                        <font-awesome-icon icon="save" /> Export
                    </button>
                </div>
            </section>
            <section id='breeds'>
                <div>
                    <label>Male breed</label>
                    <BreedDropdownResults
                        :search="query"
                        :breeds="maleBreeds"
                        @selected="selectMale"
                        class='results' />
                </div>
                <div>
                    <label>Female breed</label>
                    <BreedDropdownResults
                        :search="query"
                        :breeds="femaleBreeds"
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

export default {
    name: 'PageCheckerGen',
    components: { Lineage, BreedDropdownResults, DialogExport },

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
</style>