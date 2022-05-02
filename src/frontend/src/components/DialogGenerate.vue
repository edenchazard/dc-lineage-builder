<template>
    <Dialog
        v-show="show"
        @close="$emit('close')">
        <template v-slot:header>
          Lineage saved
        </template>
        <template v-slot:body>
            <div v-if="status.level == 0">
                <p>To share this lineage with other people, copy and paste the link below.</p>
                <p>Please note if this link is not viewed in 2 months, it will be deleted from the server.</p>
                <TextCopy v-model="viewLink" type='input' placeholder="link" />
            </div>
            <Information :info="status" />
        </template>
        <template v-slot:footer>
            <button @click="$emit('close')">Close</button>
        </template>
    </Dialog>
</template>
<script>
import { validators, backend } from '@/app/bundle.js';
import Dialog from '@/components/Dialog';
import Information from '@/components/ui/Information';
import TextCopy from '@/components/ui/TextCopy';

export default {
    name: 'DialogGenerate',
    components: { Dialog, Information, TextCopy },
    props: {
        show: Boolean,
        tree: Object
    },
    data(){
        return {
            status: {
                level: 0,
                message: ""
            },
            viewLink: ""
        }
    },

    // put our stuff in a watcher because we don't want to re-evaluate the tree
    // every time it changes, only when the dialog is shown
    watch:{
        'show'(newValue){
            this.file = "";
            this.status = { level: 0, message: "" };

            if(newValue){
                this.generateLink();
            }
        },
    },

    methods:{
        generateLink(){
            // we need a copy of the tree without vue's observables
            const lineage = JSON.parse(JSON.stringify(this.tree));
            // this could happen, we need to make sure the lineage fits
            // our requirements for saving
            if(!validators.verifyIntegrity(lineage)
            || !validators.meetsSaveRequirements(lineage)){
                this.status = {
                    level: 3,
                    message: `At least one of these dragons does not meet the save
                    requirements. Lineages must be between 1 and 13 
                    generations large, contain no placeholders or have any
                    ghost breeds. Codes and names must be valid.`
                };
                return;
            }
            (async() =>{
                try {
                    this.status = { level: 1, message: "Generating link..." };
                    const response = await backend.generateUrl(lineage);
                    this.viewLink = `${window.location.origin}${process.env.VUE_APP_URL}view/${response.data.hash}`;
                    this.status = { level: 0, message: "" };
                }
                catch (error) {
                    const { response } = error;
                    this.status = {
                        level: 3,
                        message: `Sorry, an error has occurred while
                        saving the lineage. You may want to try again
                        or export it instead.
                        The error is: ${response.status} ${response.data}`
                    };
                }
            })();
        }
    }
};
</script>