import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

type Skin = {
  cssName: string;
  prettyName: string;
  //file: () => Promise<typeof import('*.css')>;
};

export const useSkinStore = defineStore('skinStore', () => {
  const skinKey = 'skin';
  const defaultSkinName = 'skin-default';
  const _activeSkinName = useLocalStorage(skinKey, defaultSkinName);

  const availableSkins: Skin[] = [
    {
      cssName: defaultSkinName,
      prettyName: 'Default',
      //file: () => import(`../../assets/layouts/default/index.css`),
    },
    {
      cssName: 'skin-portal2',
      prettyName: 'Portal 2',
      //file:  () => import(`../../assets/layouts/portal2-light/index.css`),
    },
    {
      cssName: 'skin-portal2-light',
      prettyName: 'Portal 2 Light',
      //file: () => import(`../../assets/layouts/portal2-light/index.css`),
    },
    {
      cssName: 'skin-mobile-dark',
      prettyName: 'Mobile/Tablet Dark',
      //file: () => import(`../../assets/layouts/mobile-dark/index.css`),
    },
  ];

  function skinExists(skinName: Skin['cssName']) {
    return !!availableSkins.find((skin) => skin.cssName === skinName);
  }

  const activeSkin = computed({
    get: () => {
      // If the skin isn't valid for some reason,
      // we'll fall back to the default.
      const name = !skinExists(_activeSkinName.value)
        ? defaultSkinName
        : _activeSkinName.value;
      //availableSkins.find((skin) => skin.cssName === name)?.file();
      return name;
    },
    set: (skinName: Skin['cssName']) => {
      // this should never happen under normal operation
      // but if it does...
      if (!skinExists(skinName))
        throw new Error(`Skin ${skinName} doesn't exist`);
      _activeSkinName.value = skinName;
    },
  });

  return {
    defaultSkinName,
    availableSkins,
    activeSkin,
  };
});
