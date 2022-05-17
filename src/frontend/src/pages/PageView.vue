<template>
    <div>
      <div class='central-block'>
        <div id='status' v-if='status.level > 0'>
            <h2 v-if='status.level == 2'>{{status.title}}</h2>
            <p>{{status.message}}</p>
        </div>
        <div v-if="tree != null" id='options'>
          <span class='option'>
            <router-link :to="{ path: '/', query: { template: hash }}">Import into editor</router-link>
          </span>
          <span class='option'>
            Share link: <TextCopy v-model="shareLink" type='input' />
          </span>
        </div>
      </div>
      <div v-if="tree != null">
        <Lineage
          :tree="tree"
          :config="config" />
      </div>
    </div>
</template>
  
<script>
import Lineage from '@/components/Lineage/Lineage';
import { backend } from '@/app/bundle.js';
import TextCopy from '@/components/ui/TextCopy';

export default {
  name: 'PageView',
  components: { Lineage, TextCopy },

  data() {
    return {
      tree: null,
      shareLink: null,
      config:{
        strict: false,
        showInterface: false,
        showLabels: true,
        disabled: true
      },
      status: {
        level: 1,
        message: "Loading lineage... For big lineages, this can sometimes take a moment to load.",
        title: ""
      },
      hash: this.$route.params.hash
    }
  },
  beforeDestroy(){
      this.tree = null;
  },
  mounted(){
    /*if(!validators.isLineageHash(this.$route.params.hash)){
      this.status = { error: 2, message: "Invalid hash." };
      return;
    }
    */
    (async() => {
      try {
        this.status ={
          level: 1,
          message: `Loading lineage... For big lineages, this can sometimes
          take a moment to load.`
        };
        
        const response = await backend.getLineageData(this.hash);
        this.shareLink = `${window.location.origin}${process.env.VUE_APP_URL}view/${this.hash}`;
        this.tree = JSON.parse(response.data.dragon);
        this.status = { level: 0, message: "" };
      }
      catch (error) {
        const { response } = error;
        this.status = {
          level: 3,
          title: `${response.status} ${response.statusText}`,
          message: `Sorry, an error has occurred while loading the lineage.
          The error is: ${response.status} ${response.data}`
        };
      }
    })();
  }
}
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