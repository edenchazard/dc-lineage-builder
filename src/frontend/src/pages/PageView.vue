<template>
    <div class='central-block'>
      <div id='status' v-if='status.level > 0'>
          <h2  v-if='status.level == 2'>{{status.title}}</h2>
          <p>{{status.message}}</p>
      </div>
      <div v-if="tree != null">
        <Lineage
          :tree="tree"
          :config="config" />
        <div id='options'>
          <span class='option'>
            <router-link :to="{ path: '/', query: { template: hash }}">Import into editor</router-link>
          </span>
          <span class='option'>
          Share link: <TextCopy v-model="shareLink" type='input' />
          </span>
        </div>
      </div>
    </div>
</template>
  
<script>
import Lineage from '@/components/Lineage';
//import validators from "@/validators.js";
import axios from "axios";
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
    axios.get(`./api/lineage/${this.hash}`)
      .then((response) => {
        this.shareLink = `${window.location.origin}${process.env.BASE_URL}view/${this.hash}`;
        this.tree = JSON.parse(response.data.dragon);
        this.status = { level: 0, message: "",  title: "" };
      })
      .catch((err) => {
          err = err.response;
          this.status = {
            level: 2,
            title: `${err.status} ${err.statusText}`,
            message: (err.status >= 500 ? "Sorry, an error has occurred." : err.data)
          };
      });
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