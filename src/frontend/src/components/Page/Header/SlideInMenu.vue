<template>
  <div
    ref="mobileMenu"
    class="slide-in-menu-container"
    :aria-hidden="!isOpen"
  >
    <Transition
      name="fade"
      mode="in-out"
    >
      <div
        v-if="isOpen"
        class="blackout"
        @click="emit('change', false)"
      />
    </Transition>
    <div
      class="slide-in-menu-wrapper"
      v-bind="$attrs"
      :class="{
        open: isOpen,
      }"
    >
      <slot name="default" />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { useSwipe } from '@vueuse/core';

const emit = defineEmits<{
  (e: 'change', open: boolean): void;
}>();

const props = defineProps({
  slideThreshold: {
    type: Number,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
  },
});

const isOpen = computed(() => props.open);
const mobileMenu = ref<HTMLDivElement>();
const { activate, deactivate } = useFocusTrap(mobileMenu);
const { isSwiping, direction } = useSwipe(document.body);

watch(isOpen, (value) => {
  (value ? activate : deactivate)();
});

watch(isSwiping, () => {
  if (window.screen.width >= props.slideThreshold) {
    return;
  }

  if (direction.value === 'left') {
    emit('change', false);
  } else if (direction.value === 'right') {
    emit('change', true);
  }
});
</script>

<style>
.slide-in-menu-wrapper {
  height: 100%;
  max-width: var(--width);
  width: 100%;
  --width: 15rem;
  --negative: calc(var(--width) - var(--width) - var(--width) - 20px);
  box-sizing: border-box;
  overflow: auto;
  position: fixed;
  top: 0px;
  left: var(--negative);
  transition: 0.5s linear;
  z-index: 1000;
  display: block;
}
.slide-in-menu-wrapper.open {
  left: 0px;
}

.blackout {
  background: #000;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  position: fixed;
  z-index: 999;
  opacity: 0.5;
}

.fade-enter-from {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
