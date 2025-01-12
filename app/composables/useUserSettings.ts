import { useLocalStorage } from '@vueuse/core';

const userSettings = useLocalStorage('settings', {
  gridThreshold: 20,
});

export default userSettings;
