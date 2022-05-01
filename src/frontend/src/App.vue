<template>
  <div id="app" :class='skin'>
    <Header
      :skin="skin"
      @skinChanged="updateSkin"/>
    <main id='content'>
      <router-view :key="$route.fullPath"></router-view>
    </main>
  </div>
</template>

<script>
import 'reset-css';
import '@/assets/theming.css';
import Header from '@/components/Header';
export default {
  name: 'App',
  components: { Header },

  data() {
    return {
      skin: '',
    }
  },

  methods:{
    updateSkin(newSkin){
      this.skin = newSkin;
    }
  }
}
</script>

<style>
#app{
    margin:0;
    line-height: 1.2;
    color:var(--colourFG);
    background:var(--builderBG);
    min-height: 100vh;
}

#content{
}

/* global css */
:root {
    --maxwidth: 1000px;
    --desktop: 1024px;
    --mobile: 768px;
}
html{
    height: 100%;
    /* fixes bug with the layout not stretching for big lineages */
    overflow-x:hidden;
    width:100vw;
}
body{
    font: 14px/19.6px "PT Serif", "Times New Roman", "Times", serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 19.6px;
}
h1, h2, h3 {
    margin: 5px 0px;
}
h1{
    font-size: 50px;
}
h2{
    font-size: 40px;
}
h3 {
    font-size: 30px;
}
h4 {
    font-size: 25px;
}
#content a{
    color:var(--linkColour);
}
.central-block{
    max-width: var(--maxwidth);
    margin:0px auto;
    padding:0px 5px;
}
.list{
    list-style-type: disc;
    padding-left: 15px;
}

.themed-button{
  margin:2px;
  cursor: pointer;
  padding: 8px;
  color:var(--builderControlFG);
  background: var(--builderControlBG);
  border:none;
}
/* modal properties get overriden by the import of modal
in LineageBuilder.vue, that's why these are !importanted.*/
.modal{
    background: var(--modalBG) !important;
}
.modal .modal-footer button{
    background: var(--modalFooterBtnBG) !important;
    color: var(--modalFooterBtnFG) !important;
    border: none !important;
    border-radius: 2px;
    padding:5px;
}
.modal .modal-body{
    color:var(--modalFG) !important;
}
.modal .modal-header{
    background:var(--modalHeaderBG) !important;
    color:var(--modalHeaderFG) !important;
}
.modal .btn-close{
    color:var(--modalHeaderFG) !important;
}
</style>