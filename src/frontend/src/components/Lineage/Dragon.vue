<template>
    <li>
        <div class='tile'>
            <div>
                <BreedDropdownv2
                    v-if="!disabled && showBreedSelector===true"
                    :breeds="availableBreeds"
                    :genderFilter="gender"
                    @selected="changeBreed"
                    @close="showBreedSelector=false" />
                <DragonButton 
                    v-if="nodesFromRoot === 0"
                    class='left'
                    title='Add descendant'
                    icon="arrow-left"
                    @click="addDescendant" />
                <DragonButton 
                    v-if="nodesFromRoot > 0"
                    class='left'
                    title='Remove descendants'
                    icon="cut"
                    @click="removeDescendants" />
                <DragonPortrait
                    v-long-press="{
                        click: click,
                        longPress: longPress
                    }"
                    class="tile-portrait"
                    :class="{
                        'active': !disabled,
                        'disabled': disabled,
                        'selected': selected
                    }"
                    :data="getBreedFromData" />
                <DragonButton 
                    v-if="hasParents"
                    class='right'
                    title='Remove ancestors'
                    icon="minus"
                    @click="deleteAncestors" />
                <DragonButton 
                    v-if="hasParents"
                    class='right2'
                    title='Switch parents'
                    icon="sync-alt"
                    @click="switchParents" />
                <DragonButton 
                    v-if="!hasParents"
                    class='right'
                    title='Add ancestors'
                    icon="arrow-right"
                    @click="addAncestors" />
            </div>
            <span class='labelWarning'
                v-if='labelWarning'
                title="Warning: Label does not meet DC requirements">
                <font-awesome-icon icon="exclamation-triangle" />
            </span>
            <DragonLabelField
                :value="(display === 1 ? code : name)"
                :display="display"
                @changed="labelChanged"
                :disabled="disabled" />
            <DragonButton 
                v-if="nodesFromRoot === 0"
                title='Switch gender'
                icon="venus-mars"
                @click="switchGender" />
            <DragonButton 
                class='switchLabel'
                title='Switch label'
                icon="font"
                @click="switchLabel" />
            <DragonButton 
                v-if="hasParents"
                title='Copy ancestors'
                icon="clone"
                @click="copyBranch" />
            <DragonButton 
                title='Paste ancestors'
                icon="paste"
                @click="pasteBranch" />
        </div>
        <ul v-if="hasParents">
            <Dragon
                v-bind.sync="parents.m"
                :nodesFromRoot="nodesFromRoot+1"
                :disabled="disabled" />
            <Dragon
                v-bind.sync="parents.f"
                :nodesFromRoot="nodesFromRoot+1"
                :disabled="disabled" />
        </ul>
    </li>
</template>

<script>
/*
notes for meself
label warning is a bit hacky and needs improving
*/
import DragonLabelField from './DragonLabelField';
import BreedDropdownv2 from '@/components/BreedDropdownv2'
import DragonPortrait from "@/components/DragonPortrait";
import DragonButton from "./DragonButton";
import { GLOBALS, utils, validators, dragonBuilder } from '@/app/bundle';
import longPressDirective from "@/directives/long-press/long-press";

const
    ls = localStorage,
    { countSelected, countBreeds } = utils;

export default {
    name: 'Dragon',
    directives: {
        "long-press": longPressDirective
    },

    data(){
        return {
            showBreedSelector: false,
        }
    },

    props: {
        code: String,
        name: String,
        parents: Object,
        gender: String,
        breed: String,
        disabled: Boolean,
        display: {
            default: 1, //1: code 0: name
            type: Number
        },
        nodesFromRoot: Number,
        selected: {
            default: false,
            type: Boolean
        }
    },

    components: {
        DragonLabelField,
        BreedDropdownv2,
        DragonPortrait,
        DragonButton
    },
    computed:{
        hasParents(){
            return 'f' in this.parents;
        },

        availableBreeds(){
            // select the table
            return  (this.gender === 'm' ? GLOBALS.breeds.males : GLOBALS.breeds.females);
        },

        getBreedFromData(){
            // todo refactor
            const o = (this.gender == 'm' ? GLOBALS.breeds.males : GLOBALS.breeds.females);
            // return the breed data for this breed name or if no match, the placeholder
            return o.find((v) => v.name === this.breed) || GLOBALS.placeholder_breed;
        },
        labelWarning(){
           const a = (this.display == 1 ? validators.code(this.code) : validators.name(this.name));
           return !a;
        }
    },

    methods: {
        async switchParents(){
            const newParents = await dragonBuilder.switchParents(this, this.$store);
            this.$emit('update:parents', newParents);
        },

        switchGender(){
            const invertedGender = this.gender === 'f' ? 'm' : 'f';

            // Handle placeholder
            if(this.breed === "Placeholder"){
                this.$emit("update:gender", invertedGender);
                this.$emit("update:breed", GLOBALS.placeholder_breed.name);
                //await this.$store.dispatch('removeFromUsedBreeds', this.breed);
            }

            // Handling a non-placeholder
            else{
                // First, check that the current breed can be gender flipped
                const breedData = utils.getBreedData(this.breed);

                if(!breedData.genderOnly){
                    // This breed has both male and female genders, so flipping isn't an issue.
                    this.$emit("update:gender", invertedGender);
                }
                else{
                    // It doesn't. Replace with opposite gender and put in the placeholder.
                    this.$emit("update:gender", invertedGender);
                    this.$emit("update:breed", GLOBALS.placeholder_breed.name);
                    this.$store.dispatch('removeFromUsedBreeds', this.breed);
                }
            }
        },

        async changeBreed(e){
            this.showBreedSelector = false;

            // update the breed
            this.$emit('update:breed', e.name);
            await this.$store.dispatch('removeFromUsedBreeds', this.breed);
            await this.$store.dispatch('addToUsedBreeds', e.name);
        },

        async pasteBranch(){
            const paste = JSON.parse(ls.getItem('clipboard')) || null;

            // check there's data available
            // todo add an integrity check
            if(!paste){
                return;
            }

            // remove breed counts from previous branch
            if(this.hasParents){
                await this.$store.dispatch('removeFromUsedBreeds', countBreeds([
                    this.parents.m,
                    this.parents.f
                ]));

                //and update selection count, if we have to
                const count = countSelected(this.parents.m) + countSelected(this.parents.f);
                this.$store.commit('downSelectionCount', count);
            }

            // update with new breed counts from pasted branch
            await this.$store.dispatch('addToUsedBreeds', countBreeds([
                paste.m,
                paste.f
            ]));

            // insert the new branch
            this.$emit('update:parents', paste);
        },

        copyBranch(){
            if(this.hasParents){
                // I could change how utils.fED works but this is easier
                const noSelect = utils.cloneObj({ parents: this.parents });
        
                utils.forEveryDragon(noSelect, (dragon) => dragon.selected = false);

                ls.setItem('clipboard', JSON.stringify({ ... noSelect.parents }));
            }
        },

        // this is a bit stupid. basically, we have to make a new root node
        // for the parent with all the properties of this node
        removeDescendants(){
            // another stupid thing, child components can only emit events
            // up to the parent, so no grandchild -> grandparent stuff
            // here's where our bubble plugin changes the game.
            // it'll bubble the event up the nodes until it reaches 
            // the lineage builder component, and can be handled there.
            this.$bubble('requestRemoveDescendants', dragonBuilder.copyTreeFromComponent(this));
        },

        addDescendant(){
            this.$bubble('requestAddDescendant');
        },

        // adds a new node to the tree
        addAncestors(){
            const parents ={
                m: dragonBuilder.createDragonProperties({gender: 'm'}),
                f: dragonBuilder.createDragonProperties({gender: 'f'})
            };
            this.$emit('update:parents', parents);
        },

        // deletes this node and ancestors
        async deleteAncestors(){
            await this.$store.dispatch('removeFromUsedBreeds', countBreeds([
                this.parents.m,
                this.parents.f
            ]));

            // update selection count to reflect any potentially removed
            this.$store.commit('downSelectionCount',
                (countSelected(this.parents.m) + countSelected(this.parents.f))
            );

            this.$emit('update:parents', {});
        },

        labelChanged(value){
            const attr = (this.display === 1 ? 'code' : 'name');
            this.$emit(`update:${attr}`, value);
        },

        switchLabel(){
            this.$emit('update:display', this.display == 1 ? 0 : 1);
        },

        longPress(){
            if(this.disabled){ return; }
            if(!this.$store.state.selectionCount){
                if(!this.selected){
                    this.$emit('update:selected', true);
                    this.$store.commit('upSelectionCount');
                }
            }
            else{
                this.click();
            }
        },

        click(){
            if(this.disabled){ return; }
            if(this.$store.state.selectionCount){
                if(this.selected){
                    this.$store.commit('downSelectionCount');
                    this.$emit('update:selected', false);
                }
                else{
                    this.$store.commit('upSelectionCount');
                    this.$emit('update:selected', true);
                }
            }
            else{
                this.showBreedSelector = true;
            }
        }
    }
}
</script>

<style scoped>
.hideEdit li .tile::after{
    content: "";
    position: absolute;
    top: calc(50% - 12px);
    right: 0;
    border-top: var(--lineageLineStyle);
    width: 24px;
    height: 0;
}
li .tile:only-child::after {
    display: none;
}
li {
    position: relative;
    list-style-type: none;
    border-spacing: 1px;
    border-collapse: collapse;
}
ul, li {
    padding: 0;
    margin: 0;
}
li:first-child::before, li:last-child::after {
    display: none;
}
li::before, li::after {
    content: "";
    display: block;
    border-left: var(--lineageLineStyle);
    border-bottom: var(--lineageLineStyle);
    width: 24px;
    position: absolute;
    height: 50%;
    bottom: calc(50% + 12px);
    left: 0;
}
li:last-child>* {
    padding-bottom: 0;
}
li:first-child>* {
    padding-top: 0;
}
li>* {
    display: table-cell;
    vertical-align: middle;
}
div {
    text-align: center;
    position: relative;
    width: 120px;
    padding: 0 4px;
    box-sizing: border-box;
}
li::after {
    top: calc(50% - 14px);
    bottom: auto;
    border-bottom: 0 none;
    border-top: var(--lineageLineStyle);
}
/* end of dc styling */
.active{
    cursor: pointer;
}
.selected{
    background:#89CFF0;
    border:1px dashed #246BCE;
}
</style>
<style>
.right, .left, .right2{
    position:absolute;
    z-index: 5;
}
.left{
    left:0px;
    top:0px;
}
.right{
    right:0px;
    top:0px;
}
.right2{
    right:0px;
    top:21px;
}
.hideEdit .labelWarning, .hideEdit .control,
.hideLabels .dragon-label, .hideLabels .switchLabel,
.hideLabels .labelWarning {
  display: none;
}
</style>