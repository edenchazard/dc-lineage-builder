import { defineComponent, useTemplateRef, ref, computed, watch, resolveComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { F as FeedbackPanel } from './FeedbackPanel-BeUNta8B.mjs';
import { I as InputTextbox } from './InputTextbox-B8QLIdFs.mjs';
import { _ as _export_sfc, x as validateCode } from './server.mjs';
import '@fortawesome/vue-fontawesome';
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
import 'vue-router';
import 'yup';
import 'unique-names-generator';
import '@vueuse/integrations/useFocusTrap';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InbredChecker",
  __ssrInlineRender: true,
  setup(__props) {
    const status = useTemplateRef("status");
    const input = ref("");
    const badDragons = ref([]);
    const results = ref([]);
    const codesToCheck = computed(() => {
      try {
        return input.value.split("\n").map((line) => line.trim()).filter((line) => !!line);
      } catch {
        return [];
      }
    });
    watch(codesToCheck, () => {
      badDragons.value = [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_font_awesome_icon = resolveComponent("font-awesome-icon");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "constrain-width content" }, _attrs))} data-v-93acfdfc><div class="content-limit" data-v-93acfdfc><section id="information" data-v-93acfdfc><div data-v-93acfdfc><h1 data-v-93acfdfc>Inbred Checker</h1><p data-v-93acfdfc> This utility lets you compare the ancestry of multiple dragons to see whether the results would be inbred. </p><p data-v-93acfdfc> The inbred checker will only look at the first 12 generations for each dragon, so ancestry beyond that will not be assessed. </p><p data-v-93acfdfc> Put each code on a new line. Dragons with a `);
      _push(ssrRenderComponent(_component_font_awesome_icon, {
        class: "icon",
        icon: "times"
      }, null, _parent));
      _push(` above their code are invalid. </p></div></section><section id="dragons-to-check-form" data-v-93acfdfc><form id="form" class="form" data-v-93acfdfc><label for="input" class="label" data-v-93acfdfc>Dragons to check</label>`);
      _push(ssrRenderComponent(InputTextbox, {
        id: "input",
        modelValue: input.value,
        "onUpdate:modelValue": ($event) => input.value = $event,
        type: "textarea",
        autocomplete: "off",
        spellcheck: "false",
        rows: "10"
      }, null, _parent));
      _push(`<button type="submit" class="pointer btn"${ssrIncludeBooleanAttr(codesToCheck.value.filter(unref(validateCode)).length === 0) ? " disabled" : ""} data-v-93acfdfc> Check </button></form>`);
      _push(ssrRenderComponent(FeedbackPanel, {
        ref_key: "status",
        ref: status
      }, null, _parent));
      _push(`</section><section id="preview" data-v-93acfdfc><h2 data-v-93acfdfc>Preview</h2><ul data-v-93acfdfc><!--[-->`);
      ssrRenderList(codesToCheck.value, (code) => {
        _push(`<li data-v-93acfdfc><span class="preview" data-v-93acfdfc>`);
        if (unref(validateCode)(code) && !badDragons.value.includes(code)) {
          _push(`<a${ssrRenderAttr("href", `https://dragcave.net/lineage/${code}`)} target="_blank" class="portrait" data-v-93acfdfc><img class="picture"${ssrRenderAttr("src", `https://dragcave.net/image/${code}/1.png`)} data-v-93acfdfc></a>`);
        } else {
          _push(ssrRenderComponent(_component_font_awesome_icon, {
            class: "icon",
            icon: "times"
          }, null, _parent));
        }
        _push(`</span><span data-v-93acfdfc><button type="button" class="code-jump" data-v-93acfdfc> (${ssrInterpolate(code)}) </button></span></li>`);
      });
      _push(`<!--]--></ul></section>`);
      if (results.value.length > 0) {
        _push(`<section id="results" data-v-93acfdfc><h2 data-v-93acfdfc>Results</h2><ul class="checks" data-v-93acfdfc><!--[-->`);
        ssrRenderList(results.value, (result) => {
          _push(`<li${ssrRenderAttr("id", `dragon-${result.code}`)} class="check" data-v-93acfdfc><div class="dragon" data-v-93acfdfc><a${ssrRenderAttr("href", `https://dragcave.net/lineage/${result.code}`)} target="_blank" class="portrait" data-v-93acfdfc><img class="picture"${ssrRenderAttr("src", `https://dragcave.net/image/${result.code}/1.png`)} data-v-93acfdfc></a><span data-v-93acfdfc>${ssrInterpolate(result.name)}</span><span class="code" data-v-93acfdfc>(${ssrInterpolate(result.code)})</span></div><div class="result" data-v-93acfdfc>`);
          if (result.failed > 0) {
            _push(`<p class="warn" data-v-93acfdfc>`);
            _push(ssrRenderComponent(_component_font_awesome_icon, {
              class: "icon",
              icon: "exclamation-triangle"
            }, null, _parent));
            _push(` ${ssrInterpolate(result.failed)} dragons couldn&#39;t be checked. This is usually because the owner has blocked Lineage Builder. Checks will be unreliable and a manual check should be performed. </p>`);
          } else {
            _push(`<!---->`);
          }
          if (result.problems.length === 0 && result.selfProblems.length === 0) {
            _push(`<p data-v-93acfdfc>`);
            _push(ssrRenderComponent(_component_font_awesome_icon, {
              class: "icon",
              icon: "check"
            }, null, _parent));
            _push(` No problems detected. It isn&#39;t inbred, and breeding this dragon to any of the other dragons on your list will not produce inbred offspring. </p>`);
          } else {
            _push(`<!---->`);
          }
          if (result.selfProblems.length > 0) {
            _push(`<!--[--><p data-v-93acfdfc>`);
            _push(ssrRenderComponent(_component_font_awesome_icon, {
              class: "icon",
              icon: "times"
            }, null, _parent));
            _push(` The following dragons directly appear in the dragon&#39;s own lineage multiple times. </p><ul class="conflicts" data-v-93acfdfc><!--[-->`);
            ssrRenderList(result.selfProblems, (ancestor) => {
              _push(`<li data-v-93acfdfc><a${ssrRenderAttr("href", `https://dragcave.net/lineage/${ancestor.code}`)} target="_blank" class="portrait" data-v-93acfdfc><img class="picture"${ssrRenderAttr("src", `https://dragcave.net/image/${ancestor.code}/1.png`)} data-v-93acfdfc></a><span data-v-93acfdfc>${ssrInterpolate(ancestor.name)}</span><span class="code" data-v-93acfdfc>(${ssrInterpolate(ancestor.code)})</span></li>`);
            });
            _push(`<!--]--></ul><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          if (result.problems.length > 0) {
            _push(`<!--[--><p data-v-93acfdfc>`);
            _push(ssrRenderComponent(_component_font_awesome_icon, {
              class: "icon",
              icon: "times"
            }, null, _parent));
            _push(` When bred with certain dragons on your list, the following dragons would appear multiple times. </p><ul class="conflicts" data-v-93acfdfc><!--[-->`);
            ssrRenderList(result.problems, (ancestor) => {
              _push(`<li data-v-93acfdfc><a${ssrRenderAttr("href", `https://dragcave.net/lineage/${ancestor.code}`)} target="_blank" class="portrait" data-v-93acfdfc><img class="picture"${ssrRenderAttr("src", `https://dragcave.net/image/${ancestor.code}/1.png`)} data-v-93acfdfc></a><span data-v-93acfdfc>${ssrInterpolate(ancestor.name)}</span><span class="code" data-v-93acfdfc>(${ssrInterpolate(ancestor.code)})</span><span class="code" data-v-93acfdfc><abbr class="conflict" title="conflicts with" data-v-93acfdfc>c/w. </abbr><span class="conflict-list" data-v-93acfdfc><!--[-->`);
              ssrRenderList(ancestor.conflicts, (conflict) => {
                _push(`<button type="button" class="code-jump" data-v-93acfdfc> (${ssrInterpolate(conflict)}) </button>`);
              });
              _push(`<!--]--></span></span></li>`);
            });
            _push(`<!--]--></ul><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></li>`);
        });
        _push(`<!--]--></ul></section>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/InbredChecker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const InbredChecker = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-93acfdfc"]]);

export { InbredChecker as default };
//# sourceMappingURL=InbredChecker-BXnE4Y2Z.mjs.map
