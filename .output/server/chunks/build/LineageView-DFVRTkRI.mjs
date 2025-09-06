import { defineComponent, ref, useTemplateRef, reactive, resolveComponent, unref, isRef, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { _ as _export_sfc, I as createLineageLink } from './server.mjs';
import { L as LineageView$1 } from './LineageView-C3k_ydFt.mjs';
import { I as InputTextbox } from './InputTextbox-B8QLIdFs.mjs';
import { F as FeedbackPanel } from './FeedbackPanel-BeUNta8B.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import '@fortawesome/vue-fontawesome';
import 'yup';
import 'unique-names-generator';
import '@vueuse/integrations/useFocusTrap';
import './DragonPortrait-CBnMtC3n.mjs';
import './LineageWrapper-FeuYjQv8.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LineageView",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const tree = ref(null);
    const hash = route.params.hash;
    const shareLink = createLineageLink(hash);
    const status = useTemplateRef("status");
    const config = reactive({
      showInterface: false,
      showLabels: true,
      disabled: true
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<!--[--><h1 class="sr-only" data-v-c4c95d41>Viewing lineage</h1><div id="text" class="content-limit constrain-width" data-v-c4c95d41>`);
      _push(ssrRenderComponent(FeedbackPanel, {
        ref_key: "status",
        ref: status,
        "global-settings": { showDismiss: false }
      }, null, _parent));
      if (tree.value != null) {
        _push(`<div id="options" data-v-c4c95d41>`);
        _push(ssrRenderComponent(InputTextbox, {
          id: "share-link",
          modelValue: unref(shareLink),
          "onUpdate:modelValue": ($event) => isRef(shareLink) ? shareLink.value = $event : null,
          type: "input",
          "show-copy-button": "",
          "show-share-button": "",
          readonly: "",
          "select-all-on-focus": ""
        }, null, _parent));
        _push(ssrRenderComponent(_component_router_link, {
          rel: "nofollow",
          to: {
            path: "/",
            query: { template: unref(hash) }
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Import into editor`);
            } else {
              return [
                createTextVNode("Import into editor")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (tree.value != null) {
        _push(ssrRenderComponent(LineageView$1, {
          root: tree.value,
          config
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/LineageView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LineageView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c4c95d41"]]);

export { LineageView as default };
//# sourceMappingURL=LineageView-DFVRTkRI.mjs.map
