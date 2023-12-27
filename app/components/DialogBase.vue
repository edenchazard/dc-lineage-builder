<template>
  <div v-if="open">
    <A11yDialog
      :id="id"
      close-button-position="none"
      dialog-root="#dialogs"
      @dialog-ref="assignDialogRef"
    >
      <Transition
        name="pull"
        mode="in-out"
      >
        <div
          v-if="open"
          class="dialog"
        >
          <header class="dialog-header">
            <h1 class="dialog-header-title">
              <slot name="title">Dialog title Quick Brown Fox</slot>
            </h1>

            <div class="dialog-buttons">
              <button
                class="button close-button transition"
                type="button"
                data-a11y-dialog-hide
                aria-label="Close dialog"
                title="Close dialog"
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
              :dialog="exposeMethods"
              >Default content</slot
            >
          </main>
          <footer
            v-if="$slots.footer"
            class="dialog-footer"
          >
            <slot name="footer">Footer </slot>
          </footer>
        </div>
      </Transition>
    </A11yDialog>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { A11yDialog } from 'vue-a11y-dialog';
import '../assets/styling/dialogs.css';
// tod, very basic, hacky type to keep TS quiet.
type A11yDialogDOMEvent = 'hide' | 'show' | 'destroy' | 'create';

interface A11yDialogDOM {
  show: () => void;
  hide: () => void;
  on: (event: A11yDialogDOMEvent, callback: (element: Element) => void) => void;
}

const emit = defineEmits(['instance', 'dialogMounted', 'close', 'open']);

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

let instance: null | A11yDialogDOM;

watch(
  () => props.open,
  (value) => {
    setTimeout(() => {
      if (instance) instance[value ? 'show' : 'hide']();
    }, 50);
  },
);

function assignDialogRef(dia: A11yDialogDOM) {
  instance = dia;

  if (!instance) return;

  emit('dialogMounted');

  // watch dialog reference for updates and sync with vue
  instance.on('show', () => {
    emit('open');
  });

  instance.on('hide', () => {
    emit('close', false);
  });
}

const exposeMethods = {
  hide() {
    instance?.hide();
  },
};
</script>
