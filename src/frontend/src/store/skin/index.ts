import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';

export const useSkinStore = defineStore('skinStore', () => {
  const ls = localStorage;
  const defaultSkinName = 'skin-default';

  const availableSkins = reactive([
    { cssName: defaultSkinName, prettyName: 'Default' },
    { cssName: 'skin-portal2', prettyName: 'Portal 2' },
    { cssName: 'skin-portal2-light', prettyName: 'Portal 2 Light' },
    { cssName: 'skin-mobile-dark', prettyName: 'Mobile/Tablet Dark' },
  ]);

  const activeSkin = ref(defaultSkinName);

  // provide a skin name to set to
  // or provide no argument to run the default setup
  // this needs to be called before any modifications
  function setup() {
    // setup with localstorage skin or otherwise default
    setSkin(ls.getItem('skin') || defaultSkinName);
  }

  // Use this to change the skin, it's important to keep
  // it in sync with localstorage
  function setSkin(to: string) {
    // if the skin stored in local storage doesn't exist
    // in our skin selection (for example, if ls has been
    // tampered with), we'll default to the regular skin
    if (!availableSkins.find((skin) => skin.cssName === to)) {
      setSkin(defaultSkinName);
      return;
    }

    ls.setItem('skin', to);
    activeSkin.value = to;
  }

  return {
    defaultSkinName,
    availableSkins,
    activeSkin,
    setup,
    setSkin,
  };
});
