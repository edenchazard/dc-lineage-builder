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

  &.neutral {
    background: #949494;
  }
  &.water {
    background: #116fe8;
  }
  &.fire {
    background: hsl(360, 79%, 51%);
  }
  &.earth {
    background: #915121;
  }
  &.air {
    background: #81b9ef;
    color: #222222;
  }
  &.light {
    background: #d9d190;
    color: #222222;
  }
  &.dark {
    background: #624d4e;
  }
  &.death {
    background: #704170;
  }
  &.magi {
    background: #e11455;
  }
  &.life {
    background: #5060e1;
  }
  &.time {
    background: #378177;
  }
  &.lightning {
    background: #947100;
  }
  &.ice {
    background: #3dcef3;
    color: #222222;
  }
}
</style>
