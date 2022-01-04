<template>
  <div id="app" :class='skin'>
    <div id='top'>
      <header id='header' class='central-block'>
        <div id='header-title'>
          <router-link to="/" id="logo"><h1>Lineage Builder</h1></router-link>
          <div class='subtitle'>v{{appVersion}} by eden chazard &copy;</div>
        </div>
        <div id='header-right'>
          <nav id="menu">
            <router-link to="/">Build</router-link>
            <router-link to="/how-to">How To Use</router-link>
            <router-link to="/disclaimer">Disclaimer</router-link>
            <a href="https://dragcave.net/">DragCave</a>
          </nav>
          Skin: 
          <select
            title="Skin"
            v-model="skin"
            @change="setSkin(skin)">
            <option
              v-for="skin in availableSkins"
              :value="skin.cssName"
              :key='skin.cssName'>{{skin.prettyName}}
            </option>
          </select>
        </div>
      </header>
    </div>
    <main id='content'>
      <router-view :key="$route.fullPath"></router-view>
    </main>
  </div>
</template>

<script>
import 'reset-css';
import '@/assets/theming.css';
import { version } from '/package.json';
import * as ls from "local-storage";

export default {
  name: 'App',
  components: {  },

  data() {
    return {
      appVersion: version,
      skin: '',
      availableSkins: [
        { cssName: 'skin-default', prettyName: 'Default' },
        { cssName: 'skin-portal2', prettyName: 'Portal 2' },
        { cssName: 'skin-portal2-light', prettyName: 'Portal 2 Light' },
        { cssName: "skin-mobile-dark", prettyName: "Mobile/Tablet Dark" }
      ]
    }
  },
  mounted(){
    // set default skin if no skin set
    this.setSkin(ls.get('skin') || 'skin-default');
  },
  methods:{
    setSkin(to){
      // ensure valid skin in case it's been edited by user
      // in localstorage
      if(!this.availableSkins.find((skin) => skin.cssName === to)){
        this.setSkin('skin-default');
        return;
      }

      ls.set('skin', to);
      this.skin = to;
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
#top{
  color:#fff;
  background: var(--headerBG);
  margin-bottom: 5px;
}
#header{
  padding: 10px;
  display: flex;
  flex-direction: column;
}
#header-title{
  text-align: center;
}
#header-right{
  text-align: center;
}
#logo{
  text-decoration: none;
  color:#fff;
  display: inline-block;
}
#menu{
  margin:5px 0px;
}
#menu a{
  color:#fff;
  font-size: 15px;
  text-decoration: none;
}
#menu a:after{
  color: #fff;
  content: "\00B7";
  margin: 0 4px;
}
#menu a:last-child:after {
  content: '';
}
#content{
  padding:5px;
}

/* global css */
:root {
  --maxwidth: 1000px;
}
html{
  height: 100%;
  /* fixes bug with the layout not stretching for big lineages */
  min-width: -webkit-fill-available;
  min-width: fit-content;
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
}
.list{
  list-style-type: disc;
  padding-left: 15px;
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

@media only screen and (min-width: 768px){
  #top{
    height: 165px;
  }
  #header{
    flex-direction: row;
  }
  #header-right{
    flex:1;
    margin-top: 17px;
    text-align: right;
  }

  #header-title{
    text-align: left;
  }
}
</style>