<template>
  <ToolbarButton
    ref="button"
    aria-haspopup="true"
    :aria-expanded="visible"
    :class="{ selected: visible }"
    v-bind="$attrs"
    @click="showMenu"
  />
  <Transition
    name="fade"
    mode="out-in"
  >
    <div
      v-if="visible"
      ref="menu"
      role="menu"
      class="menu"
      :style="position"
      :aria-hidden="!visible"
      @keydown="navigateMenu"
      @click="visible = false"
    >
      <slot />
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import ToolbarButton from '../ToolbarButton.vue';

const visible = ref(false);
const position = reactive({
  top: '-1000px',
  left: '-10000px',
});

const button = ref<InstanceType<typeof ToolbarButton>>();
const menu = ref<HTMLDivElement>();

const outsideClick = (e: MouseEvent) => {
  if (button.value && e.target !== null) {
    // not triggered by button
    if (button.value.$el.isSameNode(e.target.closest('button') ?? null)) return;

    // not part of the menu
    if (!menu.value?.isSameNode(e.target.closest('.menu') ?? null))
      visible.value = false;
  }
};

watch(visible, () => {
  if (visible.value) {
    document.body.addEventListener('click', outsideClick);
    nextTick(() => focusFirstMenuItem());
  } else {
    document.body.removeEventListener('click', outsideClick);
  }
});

onBeforeUnmount(() => {
  document.body.removeEventListener('click', outsideClick);
});

// move focus to first menu item
function focusFirstMenuItem() {
  if (menu.value)
    menu.value.querySelector<HTMLButtonElement>(':not([disabled])')?.focus();
}

function showMenu() {
  visible.value = true;
  nextTick(() => {
    if (button.value) {
      // calculate menu positioning
      position.top =
        (
          button.value.$el.offsetTop + button.value.$el.offsetHeight
        ).toString() + 'px';
      position.left = button.value.$el.offsetLeft.toString() + 'px';
    }
  });
}

function navigateMenu(e: KeyboardEvent) {
  if (button.value) {
    type btn = typeof button.value.$el;

    const actions: { [key: KeyboardEvent['key']]: () => void } = {
      // we'll only move the focus up/down if we have the correct sibling
      ArrowDown: () => {
        const sibling = document.activeElement?.nextElementSibling as btn;
        if (sibling) sibling.focus();
      },
      ArrowUp: () => {
        const sibling = document.activeElement?.previousElementSibling as btn;
        if (sibling) sibling.focus();
      },
      Space: () => {
        (document.activeElement as btn).click();
        visible.value = false;
      },
    };

    if (e.code in actions) {
      // prevent page scroll
      e.preventDefault();
      // run the action
      actions[e.code]();
    } else visible.value = false;
  }
}
</script>
<style scoped>
.selected {
  color: var(--ui-builder-toolbar-menu-fg);
  background: var(--ui-builder-toolbar-menu-bg);
}
.selected:hover {
  /* the button css conflicts with our selection.
  we want to remove the hover effect when pressed.*/
  background: var(--ui-builder-toolbar-menu-bg) !important;
}
.menu {
  color: var(--ui-builder-toolbar-menu-fg);
  background: var(--ui-builder-toolbar-menu-bg);
  min-width: 50px;
  position: absolute;
  z-index: 50;
  box-shadow: 0 0 4px #000;
  border-radius: 5px;
  overflow: hidden;
}
.menu:deep(.button) {
  border-bottom: 1px solid var(--builderControlFG);
}
.menu:deep(.button):last-child {
  border-bottom: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
