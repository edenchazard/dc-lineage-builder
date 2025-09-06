import { defineComponent, ref, resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FeedbackPanel",
  __ssrInlineRender: true,
  props: {
    globalSettings: {
      type: Object,
      required: false,
      default: () => {
      }
    }
  },
  emits: ["closed"],
  setup(__props, { expose: __expose }) {
    const Feedbacks = {
      none: "none",
      warning: "exclamation-triangle",
      success: "check",
      information: "info-circle",
      error: "times"
    };
    const props = __props;
    const defaults = {
      message: "",
      type: "none",
      autoClose: -1,
      showDismiss: true
    };
    const stack = ref([]);
    const hidden = ref(true);
    const autoCloseTimeouts = ref([]);
    function getFeedbackClass(type) {
      return type in Feedbacks ? type : "None";
    }
    function convertToFeedbackProps(feedback) {
      return typeof feedback === "string" ? { message: feedback } : feedback;
    }
    function update(feedback) {
      cleanUp();
      let messages = [];
      if (!Array.isArray(feedback)) messages = [feedback];
      else messages = feedback;
      stack.value = messages.map((fd, index) => {
        const combinedProps = {
          ...defaults,
          ...props.globalSettings,
          // override with global
          ...convertToFeedbackProps(fd)
          // override and apply the settings from this instance
        };
        if (!(combinedProps.type in Feedbacks))
          throw new Error("Invalid feedback type: " + combinedProps.type);
        if (combinedProps.autoClose > -1)
          autoCloseTimeouts.value.push(
            setTimeout(() => dismiss(index), combinedProps.autoClose)
          );
        return combinedProps;
      });
      hidden.value = false;
    }
    function dismiss(index) {
      stack.value.splice(index, 1);
      if (stack.value.length === 0) close();
    }
    function close(whenClosed) {
      hidden.value = true;
      stack.value = [];
    }
    function cleanUp() {
      autoCloseTimeouts.value.forEach((id) => clearTimeout(id));
      autoCloseTimeouts.value = [];
    }
    const createShortcut = (forType) => {
      return function(feedback) {
        update({ ...convertToFeedbackProps(feedback), type: forType });
      };
    };
    const warn = createShortcut("warning");
    const info = createShortcut("information");
    const error = createShortcut("error");
    const success = createShortcut("success");
    __expose({
      update,
      warn,
      info,
      error,
      success,
      close
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_font_awesome_icon = resolveComponent("font-awesome-icon");
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "list" }, _attrs))} data-v-b8153240>`);
      ssrRenderList(stack.value, (feedback, index) => {
        _push(`<li class="${ssrRenderClass([getFeedbackClass(feedback.type), "item"])}" data-v-b8153240><span class="symbol" data-v-b8153240>`);
        _push(ssrRenderComponent(_component_font_awesome_icon, {
          class: "icon",
          icon: Feedbacks[feedback.type]
        }, null, _parent));
        _push(`</span><p data-v-b8153240>${feedback.message ?? ""}</p>`);
        if (feedback.showDismiss) {
          _push(`<button type="button" class="dismiss pointer" title="Dismiss" data-v-b8153240>`);
          _push(ssrRenderComponent(_component_font_awesome_icon, { icon: "times" }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`</ul>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FeedbackPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FeedbackPanel = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-b8153240"]]), { __name: "FeedbackPanel" });

export { FeedbackPanel as F };
//# sourceMappingURL=FeedbackPanel-BeUNta8B.mjs.map
