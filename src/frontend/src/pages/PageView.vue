<template>
    <div>
      <div class='central-block'>
        <div id='status' v-if='status.level > 0'>
            <h2 v-if='status.level == 2'>{{status.title}}</h2>
            <p>{{status.message}}</p>
        </div>
        <div v-if="tree != null" id='options'>
          <span class='option'>
            <router-link
              :to="{
                path: '/',
                query: { template: hash }
              }">Import into editor</router-link>
          </span>
          <span class='option'>
            Share link: <Textbox v-model="shareLink" type='input' :showCopyButton="true" />
          </span>
        </div>
      </div>
      <div v-if="tree != null">
        <Lineage
          :root="tree"
          :config="config" />
      </div>
    </div>
</template>
  
<script setup lang="ts">
import { reactive, ref, onBeforeUnmount, onMounted } from "vue";
import { useRoute } from 'vue-router'

import { getLineage } from "../app/api";
import { LineageConfig, LineageRoot } from "../app/types";
import { createLineageLink } from "../app/utils";

import Lineage from "../components/Lineage/Lineage.vue";
import Textbox from '../components/ui/Textbox.vue';

const route = useRoute();
const tree = ref<null | LineageRoot>(null);
const hash = route.params.hash as string;
const shareLink = createLineageLink(hash);
const config = reactive<LineageConfig>({
  showInterface: false,
  showLabels: true,
  disabled: true
});
const status = reactive({
  level: 1,
  message: "Loading lineage... For big lineages, this can sometimes take a moment to load.",
  title: ""
});

onBeforeUnmount(() => tree.value = null);

onMounted(async () => {
  try {
    Object.assign(status, {
      level: 1,
      message: `Loading lineage... For big lineages, this can sometimes
      take a moment to load.`
    });
    
    // fetch from server
    const response = await getLineage(hash);
    tree.value = response.data.dragon;
    Object.assign(status, { level: 0, message: "" });
  }
  catch (error) {
    const { response } = error;
    Object.assign(status, {
      level: 3,
      title: `${response.status} ${response.statusText}`,
      message: `Sorry, an error has occurred while loading the lineage.
      The error is: ${response.status} ${response.data}`
    });
  }
});
</script>
<style scoped>
#options{
  margin: 15px 0px;
}
.option{
  margin:5px 10px;
}
.share-link{
  width:100%;
  max-width: 480px;
}
</style>