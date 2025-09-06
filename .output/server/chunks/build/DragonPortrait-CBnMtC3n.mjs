import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DragonPortrait",
  __ssrInlineRender: true,
  props: {
    data: {
      type: Object,
      required: true
    },
    gen: {
      type: Number,
      required: false,
      default: 1
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        title: __props.data.name,
        class: "imgbox imgbox-fullsize"
      }, _attrs))} data-v-f1500bea>`);
      if (__props.data.metaData.src === "dc") {
        _push(`<img${ssrRenderAttr("src", "https://dragcave.net/image/" + __props.data.image)} class="${ssrRenderClass("fallback d-" + __props.data.image)}" data-v-f1500bea>`);
      } else if (__props.data.metaData.src === "local") {
        _push(`<span class="${ssrRenderClass("local d-" + __props.data.image)}" role="img" data-v-f1500bea></span>`);
      } else if (__props.data.metaData.src === "ghost") {
        _push(`<img loading="lazy" class="ghost"${ssrRenderAttr("src", __props.data.image)} data-v-f1500bea>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="sr-only label" data-v-f1500bea>${ssrInterpolate(__props.data.name)}</span></span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DragonPortrait.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DragonPortrait = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-f1500bea"]]), { __name: "DragonPortrait" });

export { DragonPortrait as D };
//# sourceMappingURL=DragonPortrait-CBnMtC3n.mjs.map
