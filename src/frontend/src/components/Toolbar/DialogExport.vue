<template>
    <Dialog @close="$emit('close')">
        <template v-slot:header>
            Export lineage
        </template>
        <template v-slot:body>
            <div v-if="status.level !== 3">
                <p>Copy and paste this text to a text file to import this lineage later.</p> 
                <div>
                    <TextCopy v-model="file" placeholder="Export code" />
                </div>
            </div>
            <Information :info="status" />
        </template>
        <template v-slot:footer>
            <button @click="$emit('close')">Close</button>
        </template>
    </Dialog>
</template>
<script lang="ts">
import { PropType } from "vue";
import { LineageRoot } from "../../app/types";
import { deepClone, forEveryDragon } from "../../app/utils";
import { verifyIntegrity } from "../../app/validators";

import Dialog from "../Dialog.vue";
import Information from "../ui/Information.vue"
import TextCopy from '../ui/TextCopy.vue';

export default {
    name: 'DialogExport',
    components: { Dialog, Information, TextCopy },
    props: {
        tree: {
            type: Object as PropType<LineageRoot>,
            required: true
        }
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

    mounted(){
        // we do this conversion because vue attaches getters/setters to our tree
        const exportedTree = deepClone(this.tree);

        forEveryDragon(exportedTree, dragon => {
            delete dragon.selected;
        });

        if(!verifyIntegrity(exportedTree)){
            this.status = {
                level: 3,
                message: "Error creating export code. Please ensure dragons are properly named and coded in the lineage."
            };
            return;
        }

        this.file = JSON.stringify(exportedTree);
    }
};
</script>
<style scoped>

</style>