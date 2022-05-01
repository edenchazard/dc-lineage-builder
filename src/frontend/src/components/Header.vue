<template>
<div id='top'>
    <header id='header' class='central-block'>
        <div id='header-title'>
            <router-link to="/" id="logo"><h1>Lineage Builder</h1></router-link>
            <div class='part-of'>Part of <a href='/dc/tools'>Chazza's DC Tools</a></div>
            <div class='subtitle'>v{{appVersion}} &copy; eden chazard</div>
        </div>
        <div id='header-right'>
            <nav id="menu">
            <ul>
                <li><router-link to="/">Build</router-link></li>
                <li><router-link to="/checkers">Checker Generator</router-link></li>
                <li><router-link to="/ghost-breeds">Ghost Breeds</router-link></li>
                <li><router-link to="/how-to">How To Use</router-link></li>
                <li><router-link to="/disclaimer">Disclaimer</router-link></li>
                <li><a href="https://dragcave.net/">DragCave</a></li>
            </ul>
            </nav>
            <div>
            Skin: 
            <select
                title="Skin"
                :value="skin"
                @change="setSkin($event.target.value)">
                <option
                  v-for="skin in availableSkins"
                  :value="skin.cssName"
                  :key='skin.cssName'>{{skin.prettyName}}
                </option>
            </select>
            </div>
        </div>
    </header>
</div>
</template>

<script>
import * as ls from "local-storage";

export default {
    props: {
        skin: String,
    },
  data() {
    return {
      appVersion: process.env.VUE_APP_VERSION,
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
      this.$emit('skinChanged', to);
    }
  }
}
</script>
<style scoped>
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
#header .part-of a{
  color:#fff;
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
#menu ul {
  display:grid;
}
#menu ul{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
}
#menu a{
    color:#fff;
    font-size: 15px;
    text-decoration: none;
}

@media only screen and (min-width: 1024px){
  #top{
        height: 165px;
  }
  #header{
        flex-direction: row;
  }
  #menu ul{
      display: flex;
      justify-content: flex-end;
  }
  #menu li:after{
      color: #fff;
      content: "\00B7";
      margin: 0 4px;
  }
  #menu li:last-child:after {
      content: ''; 
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