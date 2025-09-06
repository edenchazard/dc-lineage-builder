import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc, E as useShare, F as useDebounceFn } from './server.mjs';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "InputTextbox",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: String,
      required: true,
      default: ""
    },
    type: {
      type: String,
      default: "input"
    },
    tooltipTimeout: {
      type: Number,
      default: 2e3
    },
    showCopyButton: {
      type: Boolean,
      default: false
    },
    showShareButton: {
      type: Boolean,
      default: false
    },
    shareParams: {
      type: Object,
      default: () => ({})
    },
    copyButtonTitle: {
      type: String,
      default: "Copy text"
    },
    selectAllOnFocus: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "copySuccess", "copyFail"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { isSupported: shareIsSupported } = useShare();
    const tooltipState = ref(false);
    const showTooltip = ref(false);
    const input = ref();
    const timeout = computed(() => props.tooltipTimeout);
    const shareSettings = computed(() => ({
      title: "",
      text: "",
      buttonTitle: "Share text",
      ...props.shareParams
    }));
    useDebounceFn(() => {
      showTooltip.value = false;
      tooltipState.value = false;
    }, timeout.value);
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["text-box", { "two-button": __props.showCopyButton && __props.showShareButton }]
      }, _attrs))} data-v-ae49182a>`);
      if (__props.type === "input") {
        _push(`<input${ssrRenderAttrs(mergeProps({
          ref_key: "input",
          ref: input,
          class: "text interactive",
          type: "text"
        }, _ctx.$attrs, { value: __props.modelValue }))} data-v-ae49182a>`);
      } else if (__props.type === "textarea") {
        _push(`<textarea${ssrRenderAttrs(_temp0 = mergeProps({
          ref_key: "input",
          ref: input,
          class: "text interactive",
          value: __props.modelValue
        }, _ctx.$attrs), "textarea")} data-v-ae49182a>${ssrInterpolate("value" in _temp0 ? _temp0.value : "    ")}</textarea>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="buttons" data-v-ae49182a>`);
      if (__props.showShareButton && unref(shareIsSupported)) {
        _push(`<button${ssrRenderAttr("title", shareSettings.value.buttonTitle)} class="button share pointer" type="button" data-v-ae49182a>`);
        _push(ssrRenderComponent(unref(FontAwesomeIcon), {
          icon: "share",
          class: "icon"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showCopyButton) {
        _push(`<!--[--><button${ssrRenderAttr("title", __props.copyButtonTitle)} class="${ssrRenderClass([{
          success: tooltipState.value && showTooltip.value,
          fail: !tooltipState.value && showTooltip.value,
          visible: tooltipState.value
        }, "button copy pointer"])}" type="button" data-v-ae49182a>`);
        _push(ssrRenderComponent(unref(FontAwesomeIcon), {
          icon: "copy",
          class: "icon"
        }, null, _parent));
        _push(`</button>`);
        if (showTooltip.value) {
          _push(`<span class="${ssrRenderClass([{
            success: tooltipState.value && showTooltip.value,
            fail: !tooltipState.value && showTooltip.value,
            visible: tooltipState.value
          }, "tooltip"])}" data-v-ae49182a>${ssrInterpolate(tooltipState.value ? "Copied!" : "Error :(")}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InputTextbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const InputTextbox = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-ae49182a"]]), { __name: "InputTextbox" });

export { InputTextbox as I };
//# sourceMappingURL=InputTextbox-B8QLIdFs.mjs.map
