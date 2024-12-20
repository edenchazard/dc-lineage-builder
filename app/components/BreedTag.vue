<template>
  <component
    :is="as"
    class="tag"
    :class="resolveLabel(tag)"
  >
    <slot>
      {{ resolveLabel(tag) }}
    </slot>
  </component>
</template>

<script setup lang="ts">
import { resolveLabel } from '../shared/utils';

withDefaults(
  defineProps<{
    tag: string;
    as?: string;
  }>(),
  {
    as: 'span',
  },
);
</script>

<style scoped lang="postcss">
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.1rem;
  font-size: 0.7rem;
  text-transform: capitalize;
  letter-spacing: 0.05rem;
  color: white;
  background: #808080;
  line-height: 1rem;

  &.water {
    background: #2980ef;
  }
  &.fire {
    background: #e62829;
  }
  &.earth {
    background: #915121;
  }
  &.air {
    background: #81b9ef;
  }
  &.light {
    background: #bababa;
  }
  &.dark {
    background: #624d4e;
  }
  &.death {
    background: #704170;
  }
  &.magi {
    background: #ef4179;
  }
  &.life {
    background: #5060e1;
  }
  &.time {
    background: #40b5a5;
  }
  &.lightning {
    background: #fac000;
  }
  &.ice {
    background: #3dcef3;
  }
}
</style>
