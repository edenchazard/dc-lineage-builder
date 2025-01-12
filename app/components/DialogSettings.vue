<template>
  <BaseDialog
    :id="settingsDialogId"
    :open="open"
    @close="
      resetTemporarySettings();
      emit('close');
    "
  >
    <template #title>Settings</template>
    <template #default>
      <form id="settings-form">
        <label for="grid-threshold">Grid threshold</label>
        <input
          id="grid-threshold"
          v-model.number="temporarySettings.gridThreshold"
          class="interactive"
          type="number"
          name="grid-threshold"
          min="0"
          @change="
            temporarySettings.gridThreshold = Math.abs(
              ~~Number(($event.target as HTMLInputElement)?.value ?? '0'),
            )
          "
        />
        <p>
          Show results in a grid when there are more than
          {{ userSettings.gridThreshold }} results. Specify 0 to never show
          results in a grid.
        </p>
        <label for="skin-switcher">Skin</label>
        <SkinSwitcher
          id="skin-switcher"
          v-model="temporarySettings.skin"
        />
        <p>Emulate a site skin.</p>
      </form>
    </template>
    <template #footer="{ dialog }">
      <button
        class="dialog-footer-button"
        @click="dialog.close()"
      >
        Cancel
      </button>
      <button
        class="dialog-footer-button"
        @click="
          saveSettings();
          dialog.close();
        "
      >
        Save
      </button>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from './BaseDialog.vue';
import { userSettings } from '../composables/useUserSettings';
import SkinSwitcher from './SkinSwitcher.vue';
import { ref, useId, watch } from 'vue';

const settingsDialogId = useId();
const temporarySettings = ref({ ...userSettings.value });

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  open: boolean;
}>();

watch(
  () => props.open,
  (open) => {
    if (open) {
      temporarySettings.value = { ...userSettings.value };
    }
  },
);

function resetTemporarySettings() {
  temporarySettings.value = { ...userSettings.value };
}

function saveSettings() {
  userSettings.value = { ...userSettings.value, ...temporarySettings.value };
}
</script>

<style scoped>
#settings-form {
  display: grid;
  gap: 0.5rem 1rem;
  grid-template-columns: auto 1fr;
  align-items: center;

  & > label {
    font-size: 1rem;
    font-weight: bold;
  }

  & > p {
    grid-column: 1 / -1;
  }
}
</style>
