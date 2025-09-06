import { useLocalStorage } from '@vueuse/core';
import { watch } from 'vue';

const defaultSkinId = 'skin-default';

const availableSkins: Record<string, string> = {
  [defaultSkinId]: 'Default',
  'skin-portal2': 'Portal 2',
  'skin-portal2-light': 'Portal 2 Light',
  'skin-mobile-dark': 'Mobile/Tablet Dark',
};

type SkinId = keyof typeof availableSkins;

const userSettings = useLocalStorage<{
  gridThreshold: number;
  skin: SkinId;
}>('settings', {
  gridThreshold: 20,
  skin: defaultSkinId,
});

watch(
  () => userSettings.value.skin,
  (newSkin) => {
    if (!(newSkin in availableSkins)) {
      userSettings.value.skin = defaultSkinId;
    }

    document.body.className = newSkin;
  },
  { immediate: true },
);

export { availableSkins, userSettings, defaultSkinId, type SkinId };
