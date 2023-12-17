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
                class="button close-button"
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

<style lang="postcss">
.dialog-container,
.dialog-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.dialog-container {
  z-index: 1000;
  display: flex;

  > .dialog-overlay {
    z-index: 1002;
    background: rgba(0, 0, 0, 0.5);
    transition: opacity 1s;
    opacity: 0;
  }

  > .dialog-content {
    margin: auto;
    z-index: 1004;
    width: 100%;
    max-width: 31.25rem;
    max-height: 31rem;

    > .dialog {
      opacity: 0;
      transform: translateY(20%);
      transition:
        transform 0.5s linear 0.5s,
        opacity 0.5s linear 0.5s;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
    }
  }
}
.dialog-header,
.dialog-main {
  padding: 0.75rem;
}

.dialog-header {
  position: relative;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  /* background: #44300b; */
  background: var(--dialog-header-bg);
  /* color: #fff; */
  color: var(--dialog-header-fg);
  font: var(--dialog-header-font);
  /* border-radius: 0.3rem 0.3rem 0 0; */
  padding: 0.5rem 1rem;
}

.dialog-header-title {
  font-size: 1.5em;
  margin: 0px;
}

.dialog-buttons {
  right: 5px;
  position: absolute;
  top: -1.5rem;

  > .button {
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    border-radius: 50%;
    cursor: pointer;
    transform: scale(0, 0);
    transition: transform 500ms linear 300ms;

    &.close-button {
      border: none;
      /* background: lightcoral; */
      background: var(--dialog-header-closebutton-bg);
      color: #fff;
    }
  }
}

.dialog-main {
  /* background: #fff; */
  background: var(--dialog-body-bg);
  color: var(--dialog-body-fg);
}

.dialog-footer {
  text-align: right;
  background: var(--dialog-body-bg);
  /* border-radius: 0 0 0.3rem 0.3rem; */
  padding: 0.5rem;

  & .dialog-footer-button {
    padding: 0.5rem 1rem;
    /* background: #44300b; */
    background: var(--dialog-footer-button-bg);
    border: none;
    /* color: #fff; */
    color: var(--dialog-footer-button-fg);
    /* border-radius: 0.3rem; */
  }
}

/* animations */
.dialog-container:not([aria-hidden]) {
  > .dialog-overlay {
    opacity: 1;
  }

  .dialog-content .dialog {
    opacity: 1;
    transform: translateY(0%);
  }

  .button {
    transform: scale(100%, 100%);
  }
}

@media (prefers-reduced-motion) {
  .dialog-container {
    > .dialog-overlay,
    .dialog-content,
    .button {
      transition: none;
    }
  }
}

/** vendor cleanup  */

/* I don't like the way the title's been implemented, it makes the css
a little difficult, so we're opting to provide the info it needs but
hide it visually, while recreating it inside the actual dialog slot, where we
have more control */
.dialog-title {
  border: 0 !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  -webkit-clip-path: inset(50%) !important;
  clip-path: inset(50%) !important;
  height: 1px !important;
  overflow: hidden !important;
  margin: -1px !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
}
</style>
