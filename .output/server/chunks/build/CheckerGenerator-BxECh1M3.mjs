import { defineComponent, ref, watch, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc, D as DragonBuilder, p as placeholder, m as malePortraits, g as femalePortraits, s as getBreedData } from './server.mjs';
import { L as LineageView } from './LineageView-C3k_ydFt.mjs';
import { D as DialogExport, e as DialogGenerate, T as ToolbarButton, B as BreedSearch, a as BreedListFilterDropdown, b as BreedListFiltered, c as chosenTags } from './BreedListFilterDropdown-D5bdWDjN.mjs';
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
import '@fortawesome/vue-fontawesome';
import 'yup';
import 'unique-names-generator';
import '@vueuse/integrations/useFocusTrap';
import './DragonPortrait-CBnMtC3n.mjs';
import './LineageWrapper-FeuYjQv8.mjs';
import './FeedbackPanel-BeUNta8B.mjs';
import './InputTextbox-B8QLIdFs.mjs';
import 'floating-vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CheckerGenerator",
  __ssrInlineRender: true,
  setup(__props) {
    const tree = ref(DragonBuilder.createWithMetadata());
    const maleBreed = ref(placeholder.name);
    const femaleBreed = ref(placeholder.name);
    const genCount = ref(2);
    const query = ref("");
    const showExportDialog = ref(false);
    const showGenerateDialog = ref(false);
    watch(genCount, () => updateTree(tree.value.gender));
    function selectMale(breed) {
      maleBreed.value = breed.name;
      updateTree("m");
    }
    function selectFemale(breed) {
      femaleBreed.value = breed.name;
      updateTree("f");
    }
    function updateTree(finalGenGender) {
      const createParents = (gen) => {
        const branch = {
          m: DragonBuilder.createWithMetadata({
            gender: "m",
            breed: maleBreed.value
          }),
          f: DragonBuilder.createWithMetadata({
            gender: "f",
            breed: femaleBreed.value
          })
        };
        if (gen < genCount.value) {
          branch.m.parents = createParents(gen + 1);
          branch.f.parents = createParents(gen + 1);
        }
        return branch;
      };
      const final = finalGenGender === "f" ? { gender: "f", breed: femaleBreed.value } : (
        // defaults to male
        { gender: "m", breed: maleBreed.value }
      );
      tree.value = DragonBuilder.createWithMetadata({
        ...final,
        parents: createParents(2)
      });
    }
    function switchBreeds() {
      const [newFemale, newMale] = [maleBreed, femaleBreed].map(
        (breed) => getBreedData(breed.value)?.genderOnly ? placeholder.name : breed.value
      );
      maleBreed.value = newMale;
      femaleBreed.value = newFemale;
      updateTree(tree.value.gender);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(DialogExport, {
        id: "Export lineage",
        open: showExportDialog.value,
        tree: tree.value,
        onClose: ($event) => showExportDialog.value = false
      }, null, _parent));
      _push(ssrRenderComponent(DialogGenerate, {
        id: "Generate lineage",
        open: showGenerateDialog.value,
        tree: tree.value,
        onClose: ($event) => showGenerateDialog.value = false
      }, null, _parent));
      _push(`<div id="dialogs" data-v-dea84473></div><section class="constrain-width section" data-v-dea84473><div class="content-limit" data-v-dea84473><h1 data-v-dea84473>Checker Generator</h1><p data-v-dea84473> On this page you can build checkers quickly. Simply select how many generations you want it to be, the male breed (top) and the female breed (bottom). </p><p data-v-dea84473>You can then export it and import it for use with the editor.</p></div></section><div data-v-dea84473><div role="toolbar" class="section" data-v-dea84473><form id="checker-toolbar" class="form constrain-width content-limit" data-v-dea84473><div id="checker-toolbar-top" data-v-dea84473><div id="section-2" data-v-dea84473>`);
      _push(ssrRenderComponent(ToolbarButton, {
        title: "Get Link",
        icon: { icon: "link", size: "2x" },
        label: "Get Link",
        onClick: ($event) => showGenerateDialog.value = true
      }, null, _parent));
      _push(ssrRenderComponent(ToolbarButton, {
        title: "Export dragon",
        icon: { icon: "save", size: "2x" },
        label: "Export",
        onClick: ($event) => showExportDialog.value = true
      }, null, _parent));
      _push(ssrRenderComponent(ToolbarButton, {
        title: "Switch breeds",
        icon: { icon: "exchange-alt", size: "2x" },
        label: "Switch breeds",
        onClick: switchBreeds
      }, null, _parent));
      _push(`</div><div id="section-1" data-v-dea84473><label for="generations" data-v-dea84473>Generations: </label><select id="generations" title="Generations" class="interactive pointer" data-v-dea84473><!--[-->`);
      ssrRenderList(6, (index) => {
        _push(`<option${ssrRenderAttr("value", index + 1)} data-v-dea84473${ssrIncludeBooleanAttr(Array.isArray(genCount.value) ? ssrLooseContain(genCount.value, index + 1) : ssrLooseEqual(genCount.value, index + 1)) ? " selected" : ""}>${ssrInterpolate(index + 1)}</option>`);
      });
      _push(`<!--]--></select></div></div><div id="checker-toolbar-bottom" data-v-dea84473><div id="filter-controls" class="tag-list" data-v-dea84473><label for="search" data-v-dea84473>Search:</label>`);
      _push(ssrRenderComponent(BreedSearch, {
        id: "search",
        modelValue: query.value,
        "onUpdate:modelValue": ($event) => query.value = $event
      }, null, _parent));
      _push(`<label for="applied-filters" data-v-dea84473>Filters:</label>`);
      _push(ssrRenderComponent(BreedListFilterDropdown, {
        id: "applied-filters",
        container: "#filter-controls"
      }, null, _parent));
      _push(`</div></div></form></div><div id="breeds" class="section" data-v-dea84473><section class="gender" data-v-dea84473><h2 id="males" tabindex="0" data-v-dea84473> Male </h2>`);
      _push(ssrRenderComponent(BreedListFiltered, {
        id: "males",
        "aria-labelledby": "males",
        tags: unref(chosenTags),
        search: query.value,
        breeds: unref(malePortraits),
        class: "results",
        onBreedSelected: selectMale
      }, null, _parent));
      _push(`</section><section class="gender" data-v-dea84473><h2 id="females" tabindex="0" data-v-dea84473> Female </h2>`);
      _push(ssrRenderComponent(BreedListFiltered, {
        id: "females",
        "aria-labelledby": "females",
        search: query.value,
        breeds: unref(femalePortraits),
        class: "results",
        tags: unref(chosenTags),
        onBreedSelected: selectFemale
      }, null, _parent));
      _push(`</section></div></div>`);
      if (tree.value !== null) {
        _push(ssrRenderComponent(LineageView, {
          id: "lineage-wrapper",
          root: tree.value,
          config: { showInterface: false, showLabels: true, disabled: true }
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/CheckerGenerator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CheckerGenerator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dea84473"]]);

export { CheckerGenerator as default };
//# sourceMappingURL=CheckerGenerator-BxECh1M3.mjs.map
