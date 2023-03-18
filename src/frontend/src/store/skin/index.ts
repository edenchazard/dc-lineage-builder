import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

type Skin = { cssName: string; prettyName: string };

export const useSkinStore = defineStore('skinStore', () => {
  const skinKey = 'skin';
  const defaultSkinName = 'skin-default';
  const _activeSkinName = useLocalStorage(skinKey, defaultSkinName);

  const availableSkins: Skin[] = [
    { cssName: defaultSkinName, prettyName: 'Default' },
    { cssName: 'skin-portal2', prettyName: 'Portal 2' },
    { cssName: 'skin-portal2-light', prettyName: 'Portal 2 Light' },
    { cssName: 'skin-mobile-dark', prettyName: 'Mobile/Tablet Dark' },
  ];

  function skinExists(skinName: Skin['cssName']) {
    return !!availableSkins.find((skin) => skin.cssName === skinName);
  }

  const activeSkin = computed({
    get: () => {
      // If the skin isn't valid for some reason,
      // we'll fall back to the default.
      if (!skinExists(_activeSkinName.value)) return defaultSkinName;
      return _activeSkinName.value;
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
