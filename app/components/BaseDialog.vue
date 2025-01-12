<template>
  <dialog
    :id="id"
    ref="dialog"
    class="dialog"
    :class="{
      closing,
    }"
    @animationend="
      if (closing) {
        modalClosed();
      }
    "
    @click="
      (event) => {
        if (dialog && (event.target as HTMLDialogElement)?.isSameNode(dialog)) {
          close();
        }
      }
    "
  >
    <div class="dialog-inner">
      <header class="dialog-header">
        <h1 class="dialog-header-title">
          <slot name="title">Dialog title Quick Brown Fox</slot>
        </h1>

        <div class="dialog-buttons">
          <button
            class="button close-button"
            type="button"
            aria-label="Close dialog"
            title="Close dialog"
            @click="close()"
          >
            <FontAwesomeIcon
              size="2x"
              icon="times"
            />
          </button>
        </div>
      </header>

      <main class="dialog-main">
        <slot
          name="default"
          :dialog="{ close }"
          >Default content</slot
        >
      </main>

      <footer class="dialog-footer">
        <slot
          name="footer"
          :dialog="{ close }"
        >
          <button
            class="dialog-footer-button"
            @click="close()"
          >
            Close
          </button>
        </slot>
      </footer>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { nextTick, ref, useTemplateRef, watch } from 'vue';

const emit = defineEmits<{
  (e: 'instance'): void;
  (e: 'dialogMounted'): void;
  (e: 'close'): void;
  (e: 'open'): void;
}>();

const props = withDefaults(
  defineProps<{
    open: boolean;
    id: string;
  }>(),
  {
    open: false,
    id: '',
  },
);

const dialog = useTemplateRef('dialog');
const closing = ref(false);

watch(
  () => props.open,
  async (newVal) => {
    await nextTick();
    if (!dialog.value) {
      return;
    }

    if (newVal) {
      dialog.value.showModal();
    }
  },
);

function close() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dialog.value?.close();
    emit('close');
  } else {
    closing.value = true;
  }
}

function modalClosed() {
  closing.value = false;
  dialog.value?.close();
  emit('close');
}
</script>

<style>
.dialog {
  padding: 0;
  border: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
  max-width: 31.25rem;
  max-height: 31rem;
  background: var(--dialog-body-bg);

  &[open] {
    animation:
      fade-in 400ms ease-in forwards,
      pull-up 400ms ease-in-out forwards;
  }

  &.closing {
    animation:
      fade-out 200ms ease-in forwards,
      pull-down 200ms ease-in-out forwards;
  }

  &.no-transition {
    animation: none !important;
    transition: none !important;

    & .button {
      animation: none !important;
      transition: none !important;
    }
  }
}

@media only screen and (min-width: 504px) {
  .dialog {
    width: 503px;
    box-shadow: 0px 0px 200px 0px #000;
    margin-left: -250px;
    left: 50%;
  }
}

.dialog-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dialog-buttons {
  > .button {
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    border-radius: 50%;
    cursor: pointer;
    animation: enlarge 300ms ease-in forwards;

    &.close-button {
      border: none;
      background: var(--dialog-header-closebutton-bg);
      color: #fff;
    }
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: var(--dialog-header-bg);
  color: var(--dialog-header-fg);
  font: var(--dialog-header-font);
  padding: 0.5rem;
}

.dialog-header-title {
  font-size: 1.5em;
}

.dialog-main {
  background: var(--dialog-body-bg);
  color: var(--dialog-body-fg);
  flex: 1;
  display: flex;
  overflow: auto;
  flex-direction: column;
  padding: 0.5rem;
}

.dialog-footer {
  text-align: right;
  background: var(--dialog-body-bg);
  padding: 0.5rem;

  & .dialog-footer-button {
    padding: 0.5rem 1rem;
    background: var(--dialog-footer-button-bg);
    border: none;
    color: var(--dialog-footer-button-fg);
  }
}

@media (prefers-reduced-motion) {
  .dialog {
    animation: none !important;
    transition: none !important;

    & .button {
      animation: none !important;
      transition: none !important;
    }
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes pull-up {
  0% {
    transform: translateY(20%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes pull-down {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(20%);
  }
}

@keyframes enlarge {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(100%);
  }
}
</style>
