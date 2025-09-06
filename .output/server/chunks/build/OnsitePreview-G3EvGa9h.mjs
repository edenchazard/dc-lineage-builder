import { defineComponent, ref, useTemplateRef, withCtx, createVNode, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrRenderComponent, ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { F as FeedbackPanel } from './FeedbackPanel-BeUNta8B.mjs';
import { L as LineageWrapper } from './LineageWrapper-FeuYjQv8.mjs';
import { useRoute } from 'vue-router';
import { I as InputTextbox } from './InputTextbox-B8QLIdFs.mjs';
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

const _imports_0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF2GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTExLTAxVDE4OjA3OjI1WiIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTEtMDFUMTg6MDg6NTNaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTExLTAxVDE4OjA4OjUzWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMjFjOTRiNi00ZjAxLTU0NDYtYjEwOC1lZmRjYTk5MjcwMTAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjNDZhY2U1ZC0xMDk5LTBmNDMtYjhiOC1mNjUyMzU4NjE1YjEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxZTQzZjA2Zi1lOTdlLWFjNDItYjk4OS0yZDU0OTI1ZjgyODEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFlNDNmMDZmLWU5N2UtYWM0Mi1iOTg5LTJkNTQ5MjVmODI4MSIgc3RFdnQ6d2hlbj0iMjAyMS0xMS0wMVQxODowNzoyNVoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDIxYzk0YjYtNGYwMS01NDQ2LWIxMDgtZWZkY2E5OTI3MDEwIiBzdEV2dDp3aGVuPSIyMDIxLTExLTAxVDE4OjA4OjUzWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pp5VlVQAAAIQSURBVFjD7di/TgJBEAbwqzEkFJTQUQANGngBiIk9FITCkBBqGqU1MSHUtDSW1paWVlb4BnY+yHizMpdhmD3ubpeExC0+DxVuf36798/o9vrq6ZIS4RcAiC4hARRAARRAFwsqlUp5AiKZP+sbZACz2SzJcDjMBfMFMgMul0sTjqEMBoNMMB+gBMLDUYihdLvdVJQrKAGs1+uTDREoDeUCOsBQbC0RikA21NlAcmFnbakoyAzE20DMy2oFX9Mp/EwmAKMRQKcD35UKfNTrcN/rHTXUaDSOUE4gjtosFn+IPeQgUWTCUYjxBTL1cxBuTSs4eAx6n8/heTw2eW21EtBbuXzUkEQ5gwj12e8bFCLk+tnEzexiEObUtOUFmR3SIpUo22ImDDbEQdQQR3kDaaF2YA96aLcP2iFUtVotBEoOW37Co4E5graP8TTydjQMhVCFQBIlQYShxbxTjjDeDiU3CHdiA8ng+UfD2NpxBhFK4uh7jqHPaSDC0MLODZIoDYavae1kwTiD+CASR8Fm5FTxteOjIYOindrawtw1m6adbRx8rWG0dgqdh2iH8hDmjSFiK0CyGY7iV/5Clw6O0nD4M4Tc1GrqFGlT5XQtk3+phtPeo2HkfVHh2w++U7k9BbFhnO8Y+QBpQPl7G8bLTb4NpkEFBM7+XKZNV1bIWZ9cU+LvyTX89yOAAiiA/j3okvILeRcI5GeIMxkAAAAASUVORK5CYII=";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "OnsitePreview",
  __ssrInlineRender: true,
  props: {
    htmlPreview: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<ul${ssrRenderAttrs(mergeProps({ id: "lineage" }, _attrs))} data-v-93aa9341><li data-v-93aa9341><div data-v-93aa9341><span class="border" data-v-93aa9341><img${ssrRenderAttr("src", _imports_0)} alt="result placeholder" data-v-93aa9341></span><label data-v-93aa9341>Result</label></div>`);
      if (__props.htmlPreview !== "") {
        _push(`<ul data-v-93aa9341>${__props.htmlPreview ?? ""}</ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</li></ul>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OnsitePreview.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const OnsitePreview$1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-93aa9341"]]), { __name: "OnsitePreview" });
const containerID = "onsite-preview-container";
const cutoff = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "OnsitePreview",
  __ssrInlineRender: true,
  setup(__props) {
    const htmlPreview = ref("");
    const maleCode = ref("");
    const femaleCode = ref("");
    const generations = ref(0);
    ref(true);
    const status = useTemplateRef("status");
    const shareLink = ref("");
    useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="constrain-width content" data-v-392de97e><div class="content-limit" data-v-392de97e><section id="information" data-v-392de97e><div data-v-392de97e><h1 data-v-392de97e>Onsite Preview</h1><p data-v-392de97e> This utility allows you to select two dragons and combine both of their lineages to see the result. </p><p data-v-392de97e> Enter the codes for the male and the female and press preview. Lineage Builder will check the genders of both dragons, although dragons without a gender, such as ungendered hatchlings, will be ignored. </p></div></section><section id="onsite-preview-form" data-v-392de97e><form id="form" class="form" data-v-392de97e><label for="male" class="label" data-v-392de97e>Male</label><input id="male"${ssrRenderAttr("value", maleCode.value)} class="interactive" type="text" min="4" max="5" data-v-392de97e><label for="female" class="label" data-v-392de97e>Female</label><input id="female"${ssrRenderAttr("value", femaleCode.value)} class="interactive" type="text" min="4" max="5" data-v-392de97e><button type="submit" class="pointer btn" data-v-392de97e> Preview </button></form>`);
      if (shareLink.value) {
        _push(ssrRenderComponent(InputTextbox, {
          id: "share-link",
          "model-value": shareLink.value,
          "show-copy-button": "",
          "show-share-button": "",
          readonly: "",
          "select-all-on-focus": ""
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(FeedbackPanel, {
        ref_key: "status",
        ref: status
      }, null, _parent));
      _push(`</section></div></div>`);
      if (htmlPreview.value !== "") {
        _push(ssrRenderComponent(LineageWrapper, {
          id: containerID,
          generations: generations.value,
          "generation-cut-off": cutoff
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(OnsitePreview$1, { "html-preview": htmlPreview.value }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(OnsitePreview$1, { "html-preview": htmlPreview.value }, null, 8, ["html-preview"])
              ];
            }
          }),
          _: 1
        }, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/OnsitePreview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const OnsitePreview = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-392de97e"]]);

export { OnsitePreview as default };
//# sourceMappingURL=OnsitePreview-G3EvGa9h.mjs.map
