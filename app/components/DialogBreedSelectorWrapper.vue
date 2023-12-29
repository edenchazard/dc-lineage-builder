<template>
  <div
    id="breed-selector-wrapper"
    ref="rootEl"
    role="dialog"
    aria-modal="true"
  >
    <header class="dialog-header">
      <h1 class="dialog-header-title">
        <slot name="title">Choose a breed</slot>
      </h1>

      <div class="dialog-buttons">
        <button
          class="button close-button"
          type="button"
          title="Close dialog"
          @click="emit('close')"
        >
          <FontAwesomeIcon
            size="2x"
            icon="times"
          />
        </button>
      </div>
    </header>
    <main class="dialog-main">
      <slot name="content"></slot>
    </main>
  </div>
</template>
<script setup lang="ts">
import { onClickOutside, useScrollLock } from '@vueuse/core';
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const rootEl = ref<HTMLDivElement>();

// we want to hide the scroll bar when the popup is open,
// and, we'd also like to prevent overscroll happening.
const scrollLockDoc = useScrollLock(document.documentElement, true);
const scrollLockBody = useScrollLock(document.body, true);

onClickOutside(rootEl, close);

function close() {
  scrollLockDoc.value = scrollLockBody.value = false;
  emit('close');
}
</script>
<style scoped>
#breed-selector-wrapper {
  z-index: 1000;
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100%;
  margin: 0;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  overscroll-behavior: contain;
  background: var(--dialog-body-bg);
}

.dialog-main {
  flex: 1;
  display: flex;
  overflow: auto;
  flex-direction: column;
  padding: 0.5rem;
}

@media only screen and (min-width: 501px) {
  #breed-selector-wrapper {
    width: 500px;
    box-shadow: 0px 0px 200px 0px #000;
    margin-left: -250px;
    left: 50%;
  }
}

@media only screen and (min-height: 501px) {
  #breed-selector-wrapper {
    height: 500px;
    margin-top: -250px;
    top: 50%;
    box-shadow: 2px 2px 20px 1px #000;
  }
}
</style>
