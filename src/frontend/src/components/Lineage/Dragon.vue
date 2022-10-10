<template>
    <li>
        <div class='tile'>
            <div>
                <BreedDropdownv2
                    v-if="!disabled && showBreedSelector===true"
                    :breeds="availableMates"
                    :genderFilter="data.gender"
                    @selected="changeBreed"
                    @close="showBreedSelector=false" />
                <DragonButton 
                    v-if="nodesFromRoot === 0"
                    class='dragon-left'
                    title='Add descendant'
                    icon="arrow-left"
                    @click="addDescendant" />
                <DragonButton 
                    v-if="nodesFromRoot > 0"
                    class='dragon-left'
                    title='Remove descendants'
                    icon="cut"
                    @click="removeDescendants" />
                <DragonPortrait
                    v-longPress="{
                        click: click,
                        longPress: longPress
                    }"
                    class="tile-portrait"
                    :class="{
                        'active': !disabled,
                        'disabled': disabled,
                        'selected': data.selected
                    }"
                    :data="getImage" />
                <DragonButton 
                    v-if="hasAncestry"
                    class='dragon-right'
                    title='Remove ancestors'
                    icon="minus"
                    @click="deleteAncestors" />
                <DragonButton 
                    v-if="hasAncestry"
                    class='dragon-right2'
                    title='Switch parents'
                    icon="sync-alt"
                    @click="swapParents" />
                <DragonButton 
                    v-if="!hasAncestry"
                    class='dragon-right'
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
                :value="(data.display === 1 ? data.code : data.name)"
                :display="data.display"
                @changed="labelChanged"
                :disabled="disabled" />
            <DragonButton 
                v-if="nodesFromRoot === 0 && data.gender === 'm'"
                title='Switch gender to female'
                icon="mars"
                @click="switchGender" />
            <DragonButton 
                v-else-if="nodesFromRoot === 0 && data.gender === 'f'"
                title='Switch gender to male'
                icon="venus"
                @click="switchGender" />
            <DragonButton 
                class='switchLabel'
                title='Switch label'
                icon="font"
                @click="switchLabel" />
            <DragonButton 
                v-if="hasAncestry"
                title='Copy ancestors'
                icon="clone"
                @click="copyBranch" />
            <DragonButton 
                title='Paste ancestors'
                icon="paste"
                @click="pasteBranch" />
        </div>
        <ul v-if="hasAncestry">
            <Dragon
                :data="data.parents!.m"
                :nodesFromRoot="nodesFromRoot+1"
                :disabled="disabled" />
            <Dragon
                :data="data.parents!.f"
                :nodesFromRoot="nodesFromRoot+1"
                :disabled="disabled" />
        </ul>
    </li>
</template>

<script setup lang="ts">
/*
notes for meself
label warning is a bit hacky and needs improving
*/
import GLOBALS from "../../app/globals";
import { getBreedData, deepClone, forEveryDragon, getTable,
        breedEntryToPortrait, expandGender, hasParents } from "../../app/utils";
import { validateCode, validateName } from "../../app/validators";
import { switchParents, createDragonProperties } from "../../app/dragonBuilder";
import { useAppStore } from "../../store";

import DragonLabelField from './DragonLabelField.vue';
import BreedDropdownv2 from "../BreedDropdownv2.vue";
import DragonPortrait from "../DragonPortrait.vue";
import DragonButton from "./DragonButton.vue";
import { BreedEntry, DragonParents, DragonType, PortraitData } from "../../app/types";

import vLongPress from "../../directives/long-press/vue-3-long-press";
import { computed, PropType, ref } from "vue";

const props = defineProps({
    // Dragon properties
    data: {
        type: Object as PropType<DragonType>,
        required: true
    },
    // Whether to disable the click
    disabled: {
        type: Boolean,
        default: true,
        required: false
    },
    // How many gens is this?
    nodesFromRoot: {
        type: Number,
        required: true
    }
});

const ls = localStorage;
const appStore = useAppStore();
const showBreedSelector = ref(false);

const hasAncestry = computed(() => hasParents(props.data));

const availableMates = computed(() => getTable(props.data.gender));

const getImage = computed(() => {
    // return the breed data for this breed name or if no match, the placeholder
    let entry = getBreedData(props.data.breed);

    if(!entry) {
        // if unavailable, replace with placeholder
        props.data.breed = GLOBALS.placeholder.name;
        entry = getBreedData(props.data.breed) as BreedEntry;
    };

    const portrait = breedEntryToPortrait(entry, expandGender(props.data.gender));

    return portrait;
});

const labelWarning = computed(() => {
    const a = props.data.display === 1 ? validateCode(props.data.code) : validateName(props.data.name);
    return !a;
});

function swapParents(){
    props.data.parents = switchParents(props.data.parents);
}

function switchGender(){
    const invertedGender = props.data.gender === 'f' ? 'm' : 'f';

    // Handle placeholder
    if(props.data.breed === "Placeholder"){
        props.data.gender = invertedGender;
        props.data.breed = GLOBALS.placeholder.name;
    }
    // Handling a non-placeholder
    else{
        // First, check that the current breed can be gender flipped
        const entry = getBreedData(props.data.breed);

        if(!entry) return;

        if(!entry.genderOnly){
            // This breed has both male and female genders, so flipping isn't an issue.
            props.data.gender = invertedGender;
        }
        else{
            // It doesn't. Replace with opposite gender and put in the placeholder.
            props.data.gender = invertedGender;
            props.data.breed = GLOBALS.placeholder.name;
        }
    }
}

// todo type this
function changeBreed(e: PortraitData){
    showBreedSelector.value = false;

    // update the breed
    props.data.breed = e.name;
}

function pasteBranch(){
    const clipboard = ls.getItem('clipboard');

    // check there's data available
    // todo add an integrity check
    // no data... do nothing
    if(clipboard === null) return;

    // insert the new branch
    // Todo type this
    props.data.parents = JSON.parse(clipboard);
}

function copyBranch(){
    // Do nothing if no parents
    if(!hasAncestry) return;

    const noSelect = deepClone({ parents: props.data.parents });

    // We have to make sure we deselect all of them, or they'll
    // be copied as selected lol
    forEveryDragon(noSelect, (dragon) => dragon.selected = false);

    ls.setItem('clipboard', JSON.stringify({ ... noSelect.parents }));
}

// this is a bit stupid. basically, we have to make a new root node
// for the parent with all the properties of this node
function removeDescendants(){
    // another stupid thing, child components can only emit events
    // up to the parent, so no grandchild -> grandparent stuff
    // here's where our bubble plugin changes the game.
    // it'll bubble the event up the nodes until it reaches 
    // the lineage builder component, and can be handled there.
    //props.$bubble('requestRemoveDescendants', copyTreeFromComponent(this));
}

function addDescendant(){
    //props.$bubble('requestAddDescendant');
}

// adds a new node to the tree
function addAncestors(){
    const parents: DragonParents = {
        m: createDragonProperties({gender: 'm'}),
        f: createDragonProperties({gender: 'f'})
    };
    props.data.parents = parents;
}

// deletes this node and ancestors
function deleteAncestors(){
    props.data.parents = null;
}

function labelChanged(value: string){
    const attr = (props.data.display === 1 ? 'code' : 'name');
    props.data[attr] = value;
}

function switchLabel(){
    props.data.display = props.data.display === 1 ? 0 : 1;
}

function longPress(){
    if(props.disabled){ return; }
    if(!appStore.selectionCount){
        if(!props.data.selected){
            props.data.selected = true;
        }
    }
    else{
        click();
    }
}

function click(){
    if(props.disabled){ return; }
    if(appStore.selectionCount){
        props.data.selected = !props.data.selected;
    }
    else{
        showBreedSelector.value = true;
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
.dragon-right, .dragon-left, .dragon-right2{
    position:absolute;
    z-index: 5;
}
.dragon-left{
    left:0px;
    top:0px;
}
.dragon-right{
    right:0px;
    top:0px;
}
.dragon-right2{
    right:0px;
    top:21px;
}
.hideEdit .labelWarning, .hideEdit .control,
.hideLabels .dragon-label, .hideLabels .switchLabel,
.hideLabels .labelWarning {
  display: none;
}
</style>