<template>
  <component
    :is="as"
    class="tag"
    :class="slug(resolveLabel(tag))"
  >
    <slot>
      {{ resolveLabel(tag) }}
    </slot>
  </component>
</template>

<script setup lang="ts">
import { resolveLabel, slug } from '../shared/utils';

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
    background: #e51f1f;
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

  &.alpine {
    background: #e5b39b;
    color: #000;
  }
  &.forest {
    background: #d4e4df;
    color: #000;
  }
  &.desert {
    background: #e6debe;
    color: #000;
  }
  &.volcano {
    background: #b890ca;
    color: #000;
  }
  &.jungle {
    background: #bfc4bc;
    color: #000;
  }
  &.coast {
    background: #a2aabe;
    color: #000;
  }
  &.all {
    background: #805c5c;
  }

  &.christmas {
    background: #104310;
    color: #d0d0d0;
  }
  &.halloween {
    background: #000;
    color: #f70;
  }
  &.valentine {
    background: rgb(158, 78, 130);
    color: #fff;
  }

  &.pygmy {
    background: #ba5817;
  }

  &.two-head {
    background: #557991;
  }

  &.drake {
    background: #d6a624;
    color: #000;
  }
  &.standard {
    background: #1b6a0b;
  }
}
</style>
