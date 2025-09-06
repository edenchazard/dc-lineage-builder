import { defineComponent, ref, mergeProps, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, C as useScroll } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LineageViewGenerationCounter",
  __ssrInlineRender: true,
  props: {
    count: {
      type: Number,
      default: 1
    },
    // when set to 1, the lineage will not be cut off at any gen
    limit: {
      type: Number,
      default: -1
    }
  },
  setup(__props) {
    const props = __props;
    const gens = computed(() => {
      let length;
      if (props.limit > -1 && props.limit > props.count) length = props.count;
      else if (props.limit === -1) length = props.count;
      else length = props.limit;
      return Array.from({ length }, (_, i) => props.count - i);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({ class: "generation-counter" }, _attrs))} data-v-943e546b><!--[-->`);
      ssrRenderList(gens.value, (gen) => {
        _push(`<span class="generation" data-v-943e546b>${ssrInterpolate(gen)}</span>`);
      });
      _push(`<!--]--></span>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LineageViewGenerationCounter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const LineageViewGenerationCounter = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-943e546b"]]), { __name: "LineageViewGenerationCounter" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LineageWrapper",
  __ssrInlineRender: true,
  props: {
    generations: {
      type: Number,
      required: true
    },
    generationCutOff: {
      type: Number,
      required: false,
      default: -1
    }
  },
  setup(__props) {
    const lineageView = ref();
    const lineageVisible = ref(false);
    useScroll(void 0, {
      onScroll() {
        const containerTop = lineageView.value?.getBoundingClientRect().top ?? 0;
        lineageVisible.value = containerTop <= 113;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "lineageView",
        ref: lineageView,
        class: ["lineage-view", { "fixed-background": lineageVisible.value }]
      }, _attrs))} data-v-5cf19bce>`);
      _push(ssrRenderComponent(LineageViewGenerationCounter, {
        count: __props.generations,
        limit: __props.generationCutOff
      }, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LineageWrapper.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LineageWrapper = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-5cf19bce"]]), { __name: "LineageWrapper" });

export { LineageWrapper as L };
//# sourceMappingURL=LineageWrapper-FeuYjQv8.mjs.map
