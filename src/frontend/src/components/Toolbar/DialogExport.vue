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
<script>
import Dialog from '@/components/Dialog';
import { utils, validators } from '@/app/bundle.js';
import Information from '@/components/ui/Information';
import TextCopy from '@/components/ui/TextCopy';

export default {
    name: 'DialogExport',
    components: { Dialog, Information, TextCopy },
    props: {
        show: Boolean,
        tree: Object
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
        const exportedTree = utils.cloneObj(this.tree);

        utils.forEveryDragon(exportedTree, dragon => {
            delete dragon.selected;
        });

        if(!validators.verifyIntegrity(exportedTree)){
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