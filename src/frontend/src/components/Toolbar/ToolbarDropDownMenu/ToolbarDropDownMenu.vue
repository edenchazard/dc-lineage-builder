<template>
  <ToolbarButton
    ref="button"
    aria-haspopup="true"
    :aria-expanded="open"
    :class="{ selected: open }"
    :="$attrs"
    @click="open = true"
  />
  <Teleport to="body">
    <Transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="open"
        :style="floatingStyles"
        ref="menu"
        role="menu"
        class="menu"
        :aria-hidden="!open"
        @keydown.tab.prevent="open = false"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { useFloating, autoUpdate, flip } from '@floating-ui/vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import ToolbarButton from '../ToolbarButton.vue';

const button = ref<InstanceType<typeof ToolbarButton>>();
const menu = ref<HTMLDivElement>();
const open = ref<boolean>(false);

const { floatingStyles } = useFloating(button, menu, {
  strategy: 'fixed',
  transform: true,
  whileElementsMounted: autoUpdate,
  placement: 'bottom-start',
  middleware: [
    flip({
      fallbackPlacements: [
        'bottom-end',
        'bottom',
        'top-end',
        'top',
        'right',
        'left',
      ],
    }),
  ],
});

const { activate, deactivate } = useFocusTrap(menu, {
  clickOutsideDeactivates: true,

  onActivate() {
    open.value = true;
  },
  onDeactivate() {
    open.value = false;
  },
  isKeyBackward(e) {
    return e.key === 'ArrowUp';
  },
  isKeyForward(e) {
    return e.key === 'ArrowDown';
  },
});

watch(open, async (val) => {
  await nextTick();

  if (val) {
    activate();
    //focusFirstMenuItem();
  } else {
    deactivate();
  }
});
/*
// move focus to first menu item
function focusFirstMenuItem() {
  if (menu.value)
    menu.value.querySelector<HTMLButtonElement>(':not([disabled])')?.focus();
} */
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
  min-width: 11rem;
  z-index: 50;
  box-shadow: 0 0 4px #000;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.menu:deep(*) {
  border-bottom: 1px solid var(--builderControlFG);
}
.menu:deep(*):last-child {
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
