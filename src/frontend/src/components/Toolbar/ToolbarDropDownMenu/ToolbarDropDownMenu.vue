<template>
  <ToolbarButton
    ref="button"
    aria-haspopup="true"
    :aria-expanded="visible"
    :class="{ selected: visible }"
    v-bind="$attrs"
    @click="showMenu"
  />
  <div
    ref="menu"
    role="menu"
    class="menu"
    :style="position"
    :hidden="!visible"
    @keydown="navigateMenu"
    @click="visible = false"
  >
    <slot> </slot>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import ToolbarButton from '../ToolbarButton.vue';

const visible = ref(false);
const position = reactive({
  top: '0px',
  left: '0px',
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
  color: var(--builderControlFG);
  background: var(--builderControlBG);
  box-shadow: 0px 0px 2px 2px #000 inset;
}
.selected:hover {
  /* the button css conflicts with our selection.
  we want to remove the hover effect when pressed.*/
  background: var(--builderControlBG) !important;
}
.menu {
  color: var(--builderControlFG);
  background: var(--builderControlBG);
  min-width: 50px;
  position: absolute;
  z-index: 50;
  box-shadow: 0px 0px 4px #000;
  border-radius: 5px;
}
.menu:deep(.button) {
  border-bottom: 1px solid var(--builderControlFG);
}
.menu:deep(.button):last-child {
  border-bottom: none;
}
.menu[hidden] {
  visibility: hidden;
}
</style>
