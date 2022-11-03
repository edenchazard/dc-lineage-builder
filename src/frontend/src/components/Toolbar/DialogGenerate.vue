<template>
    <Dialog @close="emit('close')">
        <template v-slot:header>
          Save lineage
        </template>
        <template v-slot:body>
            <div v-if="status.level == 0">
                <p>To share this lineage with other people, copy and paste the link below.</p>
                <p>Please note if this link is not viewed in 2 months, it will be deleted from the server.</p>
                <Textbox v-model="viewLink" type='input' placeholder="link" :showCopyButton='true' />
            </div>
            <Information :info="status" />
        </template>
        <template v-slot:footer>
            <button @click="emit('close')">Close</button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
import { onMounted, PropType, reactive, ref } from 'vue';
import { verifyIntegrity, meetsSaveRequirements } from '../../app/validators';
import { createLineageLink, deepClone, forEveryDragon } from "../../app/utils";
import { saveLineage } from "../../app/api";

import Dialog from "../Dialog.vue";
import Information from "../ui/Information.vue";
import Textbox from "../ui/Textbox.vue";
import { LineageRoot } from '../../app/types';

const props = defineProps({
    tree: {
        type: Object as PropType<LineageRoot>,
        required: true
    }
});

const emit = defineEmits<{
    (e: "close"): void
}>();

const status = reactive({
    level: 0,
    message: ""
});

const viewLink = ref("");

onMounted(async () => {
    // we do this conversion to discard any getters/setters/proxies
    const exportedTree = deepClone(props.tree);

    // @ts-ignore todo but doesn't affect runtime
    forEveryDragon(exportedTree, dragon => delete dragon.selected);

    // integrity check should never fail, but better to check anyway
    const integrity = verifyIntegrity(exportedTree);
    if(integrity.failed){
        Object.assign(status, {
            level: 3,
            message: `Error reading lineage. Tests failed: ${integrity.failedTests.join(', ')}`
        });
        return;
    }

    // make sure lineages fits our requirement for saving on the server
    const saveReqs = meetsSaveRequirements(exportedTree);
    if(saveReqs.failed){
        Object.assign(status, {
            level: 3,
            message: `To save on the server, lineages must be between 2
            and 13 generations long inclusively. There must also be
            no ghost breeds. Tests failed: ${saveReqs.failedTests.join(', ')}`
        });
        return;
    }

    try {
        Object.assign(status, { level: 1, message: "Generating link..." });
        const response = await saveLineage(exportedTree);
        viewLink.value = createLineageLink(response.data.hash);
        Object.assign(status, { level: 0, message: "" });
    }
    catch (error) {
        const { response } = error;
        Object.assign(status, {
            level: 3,
            message: `Sorry, an error has occurred while
            saving the lineage. You may want to try again
            or export it instead.
            The error is: ${response.status} ${response.data}`
        });
    }
});
</script>