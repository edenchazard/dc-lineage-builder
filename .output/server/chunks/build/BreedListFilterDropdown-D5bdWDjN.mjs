import { computed, defineComponent, ref, useTemplateRef, watch, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, openBlock, createTextVNode, unref, withDirectives, isRef, vModelCheckbox, toDisplayString, withKeys, withModifiers, Fragment, renderList, nextTick, resolveDynamicComponent, renderSlot, resolveDirective, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderClass, ssrRenderVNode, ssrRenderSlot, ssrGetDirectiveProps } from 'vue/server-renderer';
import { _ as _export_sfc, L as Lineage, B as BaseDialog, z as slug, h as useSessionStorage, y as resolveLabel, p as placeholder, e as useAppStore, A as userSettings, k as hasParents } from './server.mjs';
import { F as FeedbackPanel } from './FeedbackPanel-BeUNta8B.mjs';
import { I as InputTextbox } from './InputTextbox-B8QLIdFs.mjs';
import { ValidationError } from 'yup';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { D as DragonPortrait } from './DragonPortrait-CBnMtC3n.mjs';
import { Dropdown } from 'floating-vue';

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "DragonProblem",
  __ssrInlineRender: true,
  props: {
    dragon: {
      type: Object,
      required: true
    },
    highlight: {
      type: String,
      required: false,
      default: ""
    },
    error: {
      type: String,
      required: false,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dragon-formatting-block" }, _attrs))} data-v-1162f809><ul class="node" data-v-1162f809><!--[-->`);
      ssrRenderList(unref(Lineage)(__props.dragon).withoutMetadata().raw(), (value, field) => {
        _push(`<li class="node-line" data-v-1162f809><div class="${ssrRenderClass([{ highlighted: field === __props.highlight }, "key-value"])}" data-v-1162f809>${ssrInterpolate(field)}: ${ssrInterpolate(field === "parents" && unref(hasParents)(__props.dragon) ? "{ ... }" : value)}</div>`);
        if (field === __props.highlight) {
          _push(`<div class="error" data-v-1162f809>${ssrInterpolate(__props.error)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DragonProblem.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const DragonProblem = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$8, [["__scopeId", "data-v-1162f809"]]), { __name: "DragonProblem" });
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "DialogExport",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    id: {},
    tree: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const file = ref("");
    const isError = ref(false);
    const problemDragon = ref();
    const status = useTemplateRef("status");
    function reset() {
      isError.value = false;
    }
    watch(
      () => props.open,
      () => {
        if (!status.value) return;
        reset();
        try {
          file.value = JSON.stringify(Lineage(props.tree).withoutMetadata().raw());
        } catch (_) {
          status.value.error(
            `Sorry, an error has occurred while trying to export this lineage.`
          );
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BaseDialog, mergeProps({
        id: _ctx.id,
        open: _ctx.open,
        onClose: ($event) => emit("close")
      }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Export lineage `);
          } else {
            return [
              createTextVNode(" Export lineage ")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(FeedbackPanel, {
              ref_key: "status",
              ref: status,
              "global-settings": { showDismiss: false }
            }, null, _parent2, _scopeId));
            if (!isError.value) {
              _push2(`<div class="flex flex-col"${_scopeId}><p${_scopeId}> Copy and paste this text to a text file to import this lineage later. </p>`);
              _push2(ssrRenderComponent(InputTextbox, {
                modelValue: file.value,
                "onUpdate:modelValue": ($event) => file.value = $event,
                autofocus: "",
                placeholder: "Export code",
                type: "textarea",
                readonly: "",
                "show-copy-button": true,
                "select-all-on-focus": ""
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (problemDragon.value) {
              _push2(`<div${_scopeId}> The problem dragon is: `);
              _push2(ssrRenderComponent(DragonProblem, { dragon: problemDragon.value }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(FeedbackPanel, {
                ref_key: "status",
                ref: status,
                "global-settings": { showDismiss: false }
              }, null, 512),
              !isError.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex flex-col"
              }, [
                createVNode("p", null, " Copy and paste this text to a text file to import this lineage later. "),
                createVNode(InputTextbox, {
                  modelValue: file.value,
                  "onUpdate:modelValue": ($event) => file.value = $event,
                  autofocus: "",
                  placeholder: "Export code",
                  type: "textarea",
                  readonly: "",
                  "show-copy-button": true,
                  "select-all-on-focus": ""
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : createCommentVNode("", true),
              problemDragon.value ? (openBlock(), createBlock("div", { key: 1 }, [
                createTextVNode(" The problem dragon is: "),
                createVNode(DragonProblem, { dragon: problemDragon.value }, null, 8, ["dragon"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DialogExport.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const DialogExport = Object.assign(_sfc_main$7, { __name: "DialogExport" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "DialogGenerate",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    id: {},
    tree: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const field = ref();
    const error = ref();
    const isLoadedAndOk = ref(false);
    const problemDragon = ref();
    const viewLink = ref("");
    const status = useTemplateRef("status");
    function reset() {
      isLoadedAndOk.value = false;
      problemDragon.value = void 0;
      viewLink.value = "";
    }
    watch(
      () => props.open,
      async () => {
        if (!status.value) return;
        reset();
        const incomingTree = Lineage(props.tree);
        try {
          status.value.info("Attempting to save lineage...");
          const link = await incomingTree.saveToServer();
          status.value.close(() => {
            isLoadedAndOk.value = true;
            viewLink.value = link;
          });
        } catch (ex) {
          const message = (() => {
            if (ex instanceof ValidationError) {
              field.value = ex.type;
              error.value = ex.message;
              if (ex.type !== "generation-count") {
                problemDragon.value = incomingTree.getAtPath(
                  ex.path.substring(0, ex.path?.lastIndexOf("."))
                )?.raw();
                return "The problem dragon is displayed below.";
              }
              return ex.message;
            }
            return `You may want to try again or export it instead.`;
          })();
          status.value.error(
            `Sorry, an error has occurred while
            saving the lineage.<br /> ${message}`
          );
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BaseDialog, mergeProps({
        id: _ctx.id,
        open: _ctx.open,
        onClose: ($event) => emit("close")
      }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Save lineage`);
          } else {
            return [
              createTextVNode("Save lineage")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(FeedbackPanel, {
              ref_key: "status",
              ref: status,
              "global-settings": { showDismiss: false }
            }, null, _parent2, _scopeId));
            if (isLoadedAndOk.value) {
              _push2(`<div class="flex flex-col"${_scopeId}><p${_scopeId}> To share this lineage with other people, copy and paste the link below. </p><p${_scopeId}> Please note if this link is not viewed in 2 months, it will be deleted from the server. </p>`);
              _push2(ssrRenderComponent(InputTextbox, {
                modelValue: viewLink.value,
                "onUpdate:modelValue": ($event) => viewLink.value = $event,
                autofocus: "",
                readonly: "",
                type: "input",
                placeholder: "link",
                "show-copy-button": "",
                "show-share-button": "",
                "select-all-on-focus": "",
                "copy-button-title": "Copy lineage link",
                "share-params": {
                  buttonTitle: "Share lineage",
                  title: "View my lineage",
                  text: "View my DragCave lineage on Lineage Builder"
                }
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (problemDragon.value) {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(DragonProblem, {
                dragon: problemDragon.value,
                highlight: field.value,
                error: error.value
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(FeedbackPanel, {
                ref_key: "status",
                ref: status,
                "global-settings": { showDismiss: false }
              }, null, 512),
              isLoadedAndOk.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex flex-col"
              }, [
                createVNode("p", null, " To share this lineage with other people, copy and paste the link below. "),
                createVNode("p", null, " Please note if this link is not viewed in 2 months, it will be deleted from the server. "),
                createVNode(InputTextbox, {
                  modelValue: viewLink.value,
                  "onUpdate:modelValue": ($event) => viewLink.value = $event,
                  autofocus: "",
                  readonly: "",
                  type: "input",
                  placeholder: "link",
                  "show-copy-button": "",
                  "show-share-button": "",
                  "select-all-on-focus": "",
                  "copy-button-title": "Copy lineage link",
                  "share-params": {
                    buttonTitle: "Share lineage",
                    title: "View my lineage",
                    text: "View my DragCave lineage on Lineage Builder"
                  }
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : problemDragon.value ? (openBlock(), createBlock("div", { key: 1 }, [
                createVNode(DragonProblem, {
                  dragon: problemDragon.value,
                  highlight: field.value,
                  error: error.value
                }, null, 8, ["dragon", "highlight", "error"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DialogGenerate.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const DialogGenerate = Object.assign(_sfc_main$6, { __name: "DialogGenerate" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ToolbarButton",
  __ssrInlineRender: true,
  props: {
    icon: {
      type: Object,
      default: () => ({
        icon: "dragon"
      })
    },
    label: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        "data-dragscroll": "",
        type: "button",
        class: "control interactive",
        "aria-disabled": __props.disabled,
        tabindex: __props.disabled ? -1 : 0
      }, _attrs))} data-v-672eb608>`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), mergeProps(__props.icon, { class: "icon" }), null, _parent));
      if (__props.label) {
        _push(`<span class="label" data-v-672eb608>${ssrInterpolate(__props.label)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ToolbarButton.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const ToolbarButton = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["__scopeId", "data-v-672eb608"]]), { __name: "ToolbarButton" });
const elements = [
  "light",
  "dark",
  "magi",
  "life",
  "death",
  "time",
  "earth",
  "lightning",
  "air",
  "water",
  "fire",
  "ice",
  "neutral"
];
const primaryElementTags = elements.map(
  (tag) => `p:${tag}`
);
const secondaryElementTags = elements.map(
  (tag) => `s:${tag}`
);
const bodyTypeTags = ["standard", "drake", "pygmy", "two-head"];
const bodySubtypeTags = [
  "amphiptere",
  "wingless",
  "western",
  "eastern",
  "leviathan",
  "wyvern",
  "lindwyrm",
  "wyrm"
];
const habitatTags = [
  "hybrid",
  "alpine",
  "coast",
  "desert",
  "forest",
  "jungle",
  "volcano",
  "cave",
  "all"
];
const miscTags = ["Has BSA", "summonable", "CB-only", "salt"];
const releaseTags = ["regular", "valentine", "halloween", "christmas"];
[
  ...bodyTypeTags,
  ...bodySubtypeTags,
  ...elements,
  ...primaryElementTags,
  ...secondaryElementTags,
  ...habitatTags,
  ...releaseTags,
  ...miscTags
];
if (!Set.prototype.isDisjointFrom) {
  Set.prototype.isDisjointFrom = function(other) {
    if (this.size <= other.size) {
      for (const elem of this) {
        if (other.has(elem)) return false;
      }
    } else {
      for (const elem of other.keys()) {
        if (this.has(elem)) return false;
      }
    }
    return true;
  };
}
const tagStore = useSessionStorage("tags", []);
function tagsFromModel(tags) {
  const unrefTags = unref(tags);
  const ret = {
    primaryElement: unrefTags.filter(
      (tag) => primaryElementTags.includes(
        tag
      )
    ),
    secondaryElement: unrefTags.filter(
      (tag) => secondaryElementTags.includes(
        tag
      )
    ),
    bodyType: unrefTags.filter(
      (tag) => bodyTypeTags.includes(tag)
    ),
    bodySubtype: unrefTags.filter(
      (tag) => bodySubtypeTags.includes(
        tag
      )
    ),
    habitat: unrefTags.filter(
      (tag) => habitatTags.includes(tag)
    ),
    release: unrefTags.filter(
      (tag) => releaseTags.includes(tag)
    ),
    misc: unrefTags.filter(
      (tag) => miscTags.includes(tag)
    )
  };
  return ret;
}
function filterBreedsByTagsWith(breeds, tags) {
  if (0 === tags.bodyType.length + tags.bodySubtype.length + tags.primaryElement.length + tags.secondaryElement.length + tags.habitat.length + tags.release.length + tags.misc.length) {
    return breeds;
  }
  const primaryFilters = /* @__PURE__ */ new Set([
    ...tags.primaryElement,
    ...tags.primaryElement.map(resolveLabel)
  ]);
  const secondaryFilters = /* @__PURE__ */ new Set([
    ...tags.secondaryElement,
    ...tags.secondaryElement.map(resolveLabel)
  ]);
  const bodyTypeFilters = new Set(tags.bodyType);
  const bodySubtypeFilters = new Set(tags.bodySubtype);
  const habitatFilters = new Set(tags.habitat);
  const releaseFilters = new Set(tags.release);
  const miscFilters = new Set(tags.misc);
  return breeds.filter((breed) => {
    const set = new Set(breed.metaData.tags);
    if (tags.primaryElement.length && primaryFilters.isDisjointFrom(set)) {
      return false;
    }
    if (tags.secondaryElement.length && secondaryFilters.isDisjointFrom(set)) {
      return false;
    }
    if (tags.bodyType.length && bodyTypeFilters.isDisjointFrom(set)) {
      return false;
    }
    if (tags.bodySubtype.length && bodySubtypeFilters.isDisjointFrom(set)) {
      return false;
    }
    if (tags.habitat.length && habitatFilters.isDisjointFrom(set)) {
      return false;
    }
    if (tags.release.length && releaseFilters.isDisjointFrom(set)) {
      return false;
    }
    if (tags.misc.length && miscFilters.isDisjointFrom(set)) {
      return false;
    }
    return true;
  });
}
const filtersByGroup = {
  "Primary Element": primaryElementTags,
  "Secondary Element": secondaryElementTags,
  "Body Type": bodyTypeTags,
  "Body Subtype": bodySubtypeTags,
  Habitat: habitatTags,
  Release: releaseTags,
  Miscellaneous: miscTags
};
const chosenTags = computed(() => tagsFromModel(tagStore));
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "BreedTag",
  __ssrInlineRender: true,
  props: {
    tag: {},
    as: { default: "span" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.as), mergeProps({
        class: ["tag", unref(slug)(unref(resolveLabel)(_ctx.tag))]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(`${ssrInterpolate(unref(resolveLabel)(_ctx.tag))}`);
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createTextVNode(toDisplayString(unref(resolveLabel)(_ctx.tag)), 1)
              ], true)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BreedTag.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const BreedTag = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-3400a751"]]), { __name: "BreedTag" });
const margin = 4;
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "BreedList",
  __ssrInlineRender: true,
  props: {
    compact: { type: Boolean, default: true },
    list: { default: () => [] },
    size: { default: 600 },
    id: {},
    search: { default: "" }
  },
  emits: ["breedSelected"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const searchRegExp = computed(() => new RegExp(`(${props.search})`, "gi"));
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_roving_tabindex = resolveDirective("roving-tabindex");
      const _directive_roving_tabindex_container = resolveDirective("roving-tabindex-container");
      const _cssVars = { style: {
        ":--be886d10": margin
      } };
      if (_ctx.compact && _ctx.list.length > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid" }, _attrs, _cssVars))} data-v-c711f1c8><!--[-->`);
        ssrRenderList(_ctx.list, (breed) => {
          _push(ssrRenderComponent(DragonPortrait, {
            key: breed.image,
            data: breed,
            class: "grid-cell",
            onClick: ($event) => emit("breedSelected", breed)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<ul${ssrRenderAttrs(mergeProps({ class: "breeds-list" }, _attrs, _cssVars, ssrGetDirectiveProps(_ctx, _directive_roving_tabindex_container, void 0, void 0, { vertical: true })))} data-v-c711f1c8><!--[-->`);
        ssrRenderList(_ctx.list, (breed) => {
          _push(`<li class="breed-entry" data-v-c711f1c8><button${ssrRenderAttrs(mergeProps({
            type: "button",
            class: "breed-entry-button",
            "aria-labelledby": unref(slug)(breed.name)
          }, ssrGetDirectiveProps(_ctx, _directive_roving_tabindex)))} data-v-c711f1c8>`);
          _push(ssrRenderComponent(DragonPortrait, { data: breed }, null, _parent));
          _push(`<div class="details" data-v-c711f1c8><b${ssrRenderAttr("id", unref(slug)(breed.name))} class="name" data-v-c711f1c8>${(_ctx.search ? breed.name.replaceAll(searchRegExp.value, `<mark>$1</mark>`) : breed.name) ?? ""}</b><div class="tags" data-v-c711f1c8><!--[-->`);
          ssrRenderList(breed.metaData.tags, (filter) => {
            _push(ssrRenderComponent(BreedTag, {
              key: filter,
              tag: filter
            }, null, _parent));
          });
          _push(`<!--]--></div></div></button></li>`);
        });
        _push(`<!--]--></ul>`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BreedList.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const BreedList = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-c711f1c8"]]), { __name: "BreedList" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "BreedListFiltered",
  __ssrInlineRender: true,
  props: {
    breeds: {},
    search: { default: "" },
    noResultsText: { default: "No results" },
    tags: {},
    id: {}
  },
  emits: ["breedSelected"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const appStore = useAppStore();
    const filteredBreeds = computed(() => {
      const search = props.search.toLowerCase().trim();
      const breeds = filterBreedsByTagsWith(props.breeds, props.tags);
      if (search === "") {
        return [
          ...props.breeds.filter(
            (breed) => appStore.usedBreeds.get(breed.name) !== void 0
          ),
          ...breeds.filter(
            (breed) => appStore.usedBreeds.get(breed.name) === void 0
          )
        ];
      }
      const primary = [];
      const secondary = [];
      for (const breed of breeds) {
        const position = breed.name.toLowerCase().trim().indexOf(search);
        if (position === 0) primary.push(breed);
        else if (position > -1) secondary.push(breed);
      }
      return [...primary, ...secondary];
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (filteredBreeds.value.length > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "results" }, _attrs))} data-v-1be373ee>`);
        _push(ssrRenderComponent(BreedList, mergeProps({
          id: _ctx.id,
          list: filteredBreeds.value,
          search: _ctx.search,
          compact: filteredBreeds.value.length > unref(userSettings).gridThreshold
        }, _ctx.$attrs, {
          onBreedSelected: (breed) => emit("breedSelected", breed)
        }), null, _parent));
        _push(`</div>`);
      } else {
        _push(`<p${ssrRenderAttrs(mergeProps({
          tabindex: "-1",
          class: "no-results"
        }, _attrs))} data-v-1be373ee>${ssrInterpolate(_ctx.noResultsText)}</p>`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BreedListFiltered.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const BreedListFiltered = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-1be373ee"]]), { __name: "BreedListFiltered" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BreedSearch",
  __ssrInlineRender: true,
  props: {
    modelValue: {}
  },
  emits: ["update:model-value"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<input${ssrRenderAttrs(mergeProps({
        class: "breed-search interactive",
        type: "search",
        autocomplete: "off",
        value: _ctx.modelValue
      }, _attrs))} data-v-57a27282>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BreedSearch.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const BreedSearch = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-57a27282"]]), { __name: "BreedSearch" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BreedListFilterDropdown",
  __ssrInlineRender: true,
  props: {
    container: {},
    id: {},
    placeholder: {}
  },
  setup(__props) {
    const filtersTitle = useTemplateRef("filtersTitle");
    const textEl = useTemplateRef("textEl");
    async function focusFiltersTitle() {
      await nextTick();
      setTimeout(() => filtersTitle.value?.focus(), 40);
    }
    function toggle(tags) {
      const group = new Set(tags);
      const model = new Set(tagStore.value);
      if (group.size === [...group].filter((tag) => model.has(tag)).length) {
        tags.forEach((tag) => model.delete(tag));
      } else {
        tags.forEach((tag) => model.add(tag));
      }
      tagStore.value = Array.from(model);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Dropdown), mergeProps({
        distance: 0,
        "auto-size": "min",
        "auto-boundary-max-size": "",
        container: _ctx.container,
        placement: "bottom-start",
        "overflow-padding": 10,
        "auto-hide": "",
        onApplyShow: ($event) => focusFiltersTitle()
      }, _attrs), {
        default: withCtx(({ show }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="applied-filters" data-v-2e932c86${_scopeId}><input${ssrRenderAttr("id", _ctx.id)} readonly type="text"${ssrRenderAttr("value", unref(tagStore).join(", "))} class="tag-list pointer"${ssrRenderAttr("placeholder", "placeholder" in _ctx ? _ctx.placeholder : unref(placeholder))} data-v-2e932c86${_scopeId}><span class="tag-counter" title="Applied filters" data-v-2e932c86${_scopeId}>${ssrInterpolate(unref(tagStore).length)}</span></div>`);
          } else {
            return [
              createVNode("div", { class: "applied-filters" }, [
                createVNode("input", {
                  id: _ctx.id,
                  ref_key: "textEl",
                  ref: textEl,
                  readonly: "",
                  type: "text",
                  value: unref(tagStore).join(", "),
                  class: "tag-list pointer",
                  placeholder: "placeholder" in _ctx ? _ctx.placeholder : unref(placeholder),
                  onKeydown: [
                    withKeys(($event) => show(), ["space", "enter"]),
                    withKeys(withModifiers(() => {
                    }, ["prevent", "stop"]), ["space"])
                  ],
                  onClick: ($event) => show()
                }, null, 40, ["id", "value", "placeholder", "onKeydown", "onClick"]),
                createVNode("span", {
                  class: "tag-counter",
                  title: "Applied filters",
                  onKeydown: withKeys(($event) => show(), ["space", "enter"]),
                  onClick: ($event) => show()
                }, toDisplayString(unref(tagStore).length), 41, ["onKeydown", "onClick"])
              ])
            ];
          }
        }),
        popper: withCtx(({ hide }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="filters-container" data-v-2e932c86${_scopeId}><div class="header" data-v-2e932c86${_scopeId}><p tabindex="0" class="title" data-v-2e932c86${_scopeId}> Show breeds with... </p><button class="clear-all pointer" type="button" data-v-2e932c86${_scopeId}> Clear All </button><button class="close pointer" type="button" aria-label="Close filters" title="Close filters" data-v-2e932c86${_scopeId}>`);
            _push2(ssrRenderComponent(unref(FontAwesomeIcon), {
              size: "2x",
              icon: "times"
            }, null, _parent2, _scopeId));
            _push2(`</button></div><form data-v-2e932c86${_scopeId}><ul class="filter-menu" data-v-2e932c86${_scopeId}><!--[-->`);
            ssrRenderList(unref(filtersByGroup), (tags, name) => {
              _push2(`<li data-v-2e932c86${_scopeId}><fieldset data-v-2e932c86${_scopeId}><div class="group" data-v-2e932c86${_scopeId}><input${ssrRenderAttr("id", unref(slug)(name))}${ssrIncludeBooleanAttr(new Set(unref(tagStore)).isSupersetOf(new Set(tags))) ? " checked" : ""} type="checkbox" data-v-2e932c86${_scopeId}><legend${ssrRenderAttr("aria-labelledby", "group-" + unref(slug)(name))} data-v-2e932c86${_scopeId}><label${ssrRenderAttr("id", "group-" + unref(slug)(name))}${ssrRenderAttr("for", unref(slug)(name))} data-v-2e932c86${_scopeId}>${ssrInterpolate(name)}</label></legend></div><ul class="tag-set" data-v-2e932c86${_scopeId}><!--[-->`);
              ssrRenderList(tags, (tag) => {
                _push2(ssrRenderComponent(BreedTag, {
                  key: tag,
                  as: "li",
                  tag
                }, {
                  default: withCtx((_, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<input${ssrRenderAttr("id", unref(slug)(tag))}${ssrIncludeBooleanAttr(Array.isArray(unref(tagStore)) ? ssrLooseContain(unref(tagStore), tag) : unref(tagStore)) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", tag)} class="white" data-v-2e932c86${_scopeId2}><label${ssrRenderAttr("for", unref(slug)(tag))} data-v-2e932c86${_scopeId2}>${ssrInterpolate(unref(resolveLabel)(tag))}</label>`);
                    } else {
                      return [
                        withDirectives(createVNode("input", {
                          id: unref(slug)(tag),
                          "onUpdate:modelValue": ($event) => isRef(tagStore) ? tagStore.value = $event : null,
                          type: "checkbox",
                          value: tag,
                          class: "white"
                        }, null, 8, ["id", "onUpdate:modelValue", "value"]), [
                          [vModelCheckbox, unref(tagStore)]
                        ]),
                        createVNode("label", {
                          for: unref(slug)(tag)
                        }, toDisplayString(unref(resolveLabel)(tag)), 9, ["for"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></ul></fieldset></li>`);
            });
            _push2(`<!--]--></ul></form></div>`);
          } else {
            return [
              createVNode("div", {
                class: "filters-container",
                onKeydown: withKeys(withModifiers(($event) => {
                  hide();
                  textEl.value?.focus();
                }, ["prevent", "stop"]), ["escape"])
              }, [
                createVNode("div", { class: "header" }, [
                  createVNode("p", {
                    ref_key: "filtersTitle",
                    ref: filtersTitle,
                    tabindex: "0",
                    class: "title"
                  }, " Show breeds with... ", 512),
                  createVNode("button", {
                    class: "clear-all pointer",
                    type: "button",
                    onClick: ($event) => tagStore.value = []
                  }, " Clear All ", 8, ["onClick"]),
                  createVNode("button", {
                    class: "close pointer",
                    type: "button",
                    "aria-label": "Close filters",
                    title: "Close filters",
                    onClick: ($event) => {
                      hide();
                      textEl.value?.focus();
                    }
                  }, [
                    createVNode(unref(FontAwesomeIcon), {
                      size: "2x",
                      icon: "times"
                    })
                  ], 8, ["onClick"])
                ]),
                createVNode("form", null, [
                  createVNode("ul", { class: "filter-menu" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(filtersByGroup), (tags, name) => {
                      return openBlock(), createBlock("li", { key: name }, [
                        createVNode("fieldset", null, [
                          createVNode("div", { class: "group" }, [
                            createVNode("input", {
                              id: unref(slug)(name),
                              checked: new Set(unref(tagStore)).isSupersetOf(new Set(tags)),
                              type: "checkbox",
                              onChange: ($event) => toggle(tags)
                            }, null, 40, ["id", "checked", "onChange"]),
                            createVNode("legend", {
                              "aria-labelledby": "group-" + unref(slug)(name)
                            }, [
                              createVNode("label", {
                                id: "group-" + unref(slug)(name),
                                for: unref(slug)(name)
                              }, toDisplayString(name), 9, ["id", "for"])
                            ], 8, ["aria-labelledby"])
                          ]),
                          createVNode("ul", { class: "tag-set" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(tags, (tag) => {
                              return openBlock(), createBlock(BreedTag, {
                                key: tag,
                                as: "li",
                                tag
                              }, {
                                default: withCtx(() => [
                                  withDirectives(createVNode("input", {
                                    id: unref(slug)(tag),
                                    "onUpdate:modelValue": ($event) => isRef(tagStore) ? tagStore.value = $event : null,
                                    type: "checkbox",
                                    value: tag,
                                    class: "white"
                                  }, null, 8, ["id", "onUpdate:modelValue", "value"]), [
                                    [vModelCheckbox, unref(tagStore)]
                                  ]),
                                  createVNode("label", {
                                    for: unref(slug)(tag)
                                  }, toDisplayString(unref(resolveLabel)(tag)), 9, ["for"])
                                ]),
                                _: 2
                              }, 1032, ["tag"]);
                            }), 128))
                          ])
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ], 40, ["onKeydown"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BreedListFilterDropdown.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BreedListFilterDropdown = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-2e932c86"]]), { __name: "BreedListFilterDropdown" });

export { BreedSearch as B, DialogExport as D, ToolbarButton as T, BreedListFilterDropdown as a, BreedListFiltered as b, chosenTags as c, tagStore as d, DialogGenerate as e, filterBreedsByTagsWith as f, tagsFromModel as t };
//# sourceMappingURL=BreedListFilterDropdown-D5bdWDjN.mjs.map
