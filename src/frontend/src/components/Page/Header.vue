<template>
  <div id="top">
    <header
      id="header"
      class="central-block"
    >
      <div id="header-title">
        <router-link
          id="logo"
          to="/"
          ><h1>Lineage Builder</h1></router-link
        >
        <div class="part-of">
          Part of <a href="/dc/tools">Chazza's DC Tools</a>
        </div>
        <div class="subtitle">
          v{{ appStore.appVersion }} &copy; eden chazard
        </div>
        <div class="icons">
          <a
            title="Ko-fi donation link"
            href="https://ko-fi.com/dctools"
          >
            <font-awesome-icon
              icon="fa-solid fa-mug-hot"
              size="2x"
            />
          </a>
          <a
            title="Github"
            href="https://github.com/edenchazard/dc-lineage-builder"
          >
            <font-awesome-icon
              icon="fa-brands fa-github"
              size="2x"
            />
          </a>
        </div>
      </div>
      <div id="header-right">
        <nav id="menu">
          <ul>
            <li><router-link to="/">Build</router-link></li>
            <li><router-link to="/checkers">Checker Generator</router-link></li>
            <li><router-link to="/ghost-breeds">Ghost Breeds</router-link></li>
            <li>
              <router-link to="/onsite-preview">Onsite Preview</router-link>
            </li>
            <li><router-link to="/tutorial">Tutorial</router-link></li>
            <li><router-link to="/disclaimer">Disclaimer</router-link></li>
            <li><a href="https://dragcave.net/">DragCave</a></li>
          </ul>
        </nav>
        <div>
          Skin:
          <select
            v-model="skinStore.activeSkin"
            title="Skin"
          >
            <option
              v-for="skin in skinStore.availableSkins"
              :key="skin.cssName"
              :value="skin.cssName"
            >
              {{ skin.prettyName }}
            </option>
          </select>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../../store/app';
import { useSkinStore } from '../../store/skin';

const appStore = useAppStore();
const skinStore = useSkinStore();
</script>
<style scoped>
#top {
  color: #fff;
  background: var(--headerBG);
  margin-bottom: 5px;
}
#header {
  padding: 10px;
  display: flex;
  flex-direction: column;
}
#header-title {
  text-align: center;
}
#header .icons svg {
  color: #fff;
  margin: 2px;
}
#header .part-of a {
  color: #fff;
}
#header-right {
  text-align: center;
}
#logo {
  text-decoration: none;
  color: #fff;
  display: inline-block;
}
#menu {
  margin: 5px 0px;
}
#menu ul {
  display: grid;
}
#menu ul {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
}
#menu a {
  color: #fff;
  font-size: 15px;
  text-decoration: none;
}

@media only screen and (min-width: 1024px) {
  #top {
    height: 165px;
  }
  #header {
    flex-direction: row;
  }
  #menu ul {
    display: flex;
    justify-content: flex-end;
  }
  #menu li:after {
    color: #fff;
    content: '\00B7';
    margin: 0 4px;
  }
  #menu li:last-child:after {
    content: '';
  }
  #header-right {
    flex: 1;
    margin-top: 17px;
    text-align: right;
  }
  #header-title {
    text-align: left;
  }
}
</style>
