<template>
  <div
    class="focusable-dialog"
    role="dialog"
    aria-modal="true"
    ref="rootEl"
  >
    <div id="modal-header">
      <slot name="title"> Dialog Title </slot>
      <slot name="close">
        <button
          class="close themed-button"
          @click="close"
        >
          close
        </button>
      </slot>
    </div>
    <div id="modal-description">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
// I know this is hacky but this is the easiest and most optimal solution
// I could think of
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const rootEl = ref<HTMLDivElement>();

function outsideEvent(e: MouseEvent) {
  // Check whether the clicked element exists within the parent node
  // of the root element. If it doesn't, we can conclude to close the
  // dialog
  if (e.target && !rootEl.value?.parentNode?.contains(e.target as HTMLElement))
    close();
}

onMounted(() => {
  hideBodyScrollbar();
  document.addEventListener('click', outsideEvent);
});

onUnmounted(cleanUp);

function hideBodyScrollbar() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

function unhideBodyScrollbar() {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

function cleanUp() {
  unhideBodyScrollbar();
  document.removeEventListener('click', outsideEvent);
}

function close() {
  cleanUp();
  emit('close');
}
</script>
<style scoped>
.focusable-dialog {
  background: #fff;
  z-index: 99;
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100%;
  margin: 0px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  padding: 4px;
  overscroll-behavior: contain;
}
#modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}
#modal-description {
  flex: 1;
  display: flex;
  overflow: auto;
  flex-direction: column;
}
@media only screen and (min-width: 501px) {
  .focusable-dialog {
    width: 500px;
    -webkit-box-shadow: 0px 0px 200px 0px #000000;
    box-shadow: 0px 0px 200px 0px #000000;
    margin-left: -250px;
    left: 50%;
  }
}
@media only screen and (min-height: 501px) {
  .focusable-dialog {
    height: 500px;
    /* https://stackoverflow.com/questions/2005954/center-a-positionfixed-element */
    margin-top: -250px;
    top: 50%;
    -webkit-box-shadow: 0px 0px 200px 0px #000000;
    box-shadow: 0px 0px 200px 0px #000000;
  }
}
</style>
