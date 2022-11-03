<template>
    <Dialog @close="emit('close')">
        <template v-slot:header>
            Export lineage
        </template>
        <template v-slot:body>
            <div v-if="status.level !== 3">
                <p>Copy and paste this text to a text file to import this lineage later.</p> 
                <div>
                    <Textbox
                        v-model="file"
                        placeholder="Export code"
                        type="textarea"
                        readonly
                        :showCopyButton="true" />
                </div>
            </div>
            <Information :info="status" />
        </template>
        <template v-slot:footer>
            <button @click="emit('close')">Close</button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
import { onMounted, PropType, reactive, ref } from "vue";
import { LineageRoot } from "../../app/types";
import { deepClone, forEveryDragon } from "../../app/utils";
import { verifyIntegrity } from "../../app/validators";

import Dialog from "../Dialog.vue";
import Information from "../ui/Information.vue"
import Textbox from '../ui/Textbox.vue';

const props = defineProps({
    tree: {
        type: Object as PropType<LineageRoot>,
        required: true
    }
});

const emit = defineEmits<{
    (e: "close"): void
}>();

const file = ref("");
const status = reactive({
    level: 0,
    message: ""
});

onMounted(() => {
    // we do this conversion to discard any getters/setters/proxies
    const exportedTree = deepClone(props.tree);

    // todo but doesn't affect runtime
    // @ts-ignore
    forEveryDragon(exportedTree, dragon => delete dragon.selected);

    const { failed, failedTests } = verifyIntegrity(exportedTree);
  
    if(failed){
        Object.assign(status, {
            level: 3,
            message: `Error creating export code. Tests failed: ${failedTests.join(', ')}`
        });
        return;
    }

    file.value = JSON.stringify(exportedTree);
    console.log(file.value)
});
</script>