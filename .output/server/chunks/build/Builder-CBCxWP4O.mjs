import { computed, unref, ref, shallowRef, watch, getCurrentScope, onScopeDispose, shallowReadonly, defineComponent, reactive, useTemplateRef, mergeProps, nextTick, withCtx, isRef, createVNode, withKeys, withModifiers, withDirectives, vShow, resolveDirective, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, vModelSelect, resolveComponent, resolveDynamicComponent, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrGetDirectiveProps, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderSlot, ssrRenderTeleport, ssrRenderStyle, ssrRenderAttr, ssrRenderVNode } from 'vue/server-renderer';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { _ as _export_sfc, e as useAppStore, j as useFullscreen, L as Lineage, h as useSessionStorage, o as onStartTyping, i as getTable, f as useResizeObserver, p as placeholder, l as listOfBreeds, m as malePortraits, g as femalePortraits, B as BaseDialog, d as dragonSchema, k as hasParents, D as DragonBuilder } from './server.mjs';
import { B as BreedSearch, a as BreedListFilterDropdown, b as BreedListFiltered, c as chosenTags, f as filterBreedsByTagsWith, t as tagsFromModel, d as tagStore, D as DialogExport, e as DialogGenerate, T as ToolbarButton } from './BreedListFilterDropdown-D5bdWDjN.mjs';
import { I as InputTextbox } from './InputTextbox-B8QLIdFs.mjs';
import { F as FeedbackPanel } from './FeedbackPanel-BeUNta8B.mjs';
import { computePosition, flip, autoUpdate } from '@floating-ui/dom';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { L as LineageView, u as useBreedSelector } from './LineageView-C3k_ydFt.mjs';
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
import './DragonPortrait-CBnMtC3n.mjs';
import 'floating-vue';
import './LineageWrapper-FeuYjQv8.mjs';

function unwrapElement(element) {
  var _$el;
  return (_$el = element == null ? void 0 : element.$el) != null ? _$el : element;
}

function getDPR(element) {
  {
    return 1;
  }
}

function roundByDPR(element, value) {
  const dpr = getDPR();
  return Math.round(value * dpr) / dpr;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element next to a reference element when it is given a certain CSS positioning strategy.
 * @param reference The reference template ref.
 * @param floating The floating template ref.
 * @param options The floating options.
 * @see https://floating-ui.com/docs/vue
 */
function useFloating(reference, floating, options) {
  if (options === void 0) {
    options = {};
  }
  const whileElementsMountedOption = options.whileElementsMounted;
  const openOption = computed(() => {
    var _unref;
    return (_unref = unref(options.open)) != null ? _unref : true;
  });
  const middlewareOption = computed(() => unref(options.middleware));
  const placementOption = computed(() => {
    var _unref2;
    return (_unref2 = unref(options.placement)) != null ? _unref2 : 'bottom';
  });
  const strategyOption = computed(() => {
    var _unref3;
    return (_unref3 = unref(options.strategy)) != null ? _unref3 : 'absolute';
  });
  const transformOption = computed(() => {
    var _unref4;
    return (_unref4 = unref(options.transform)) != null ? _unref4 : true;
  });
  const referenceElement = computed(() => unwrapElement(reference.value));
  const floatingElement = computed(() => unwrapElement(floating.value));
  const x = ref(0);
  const y = ref(0);
  const strategy = ref(strategyOption.value);
  const placement = ref(placementOption.value);
  const middlewareData = shallowRef({});
  const isPositioned = ref(false);
  const floatingStyles = computed(() => {
    const initialStyles = {
      position: strategy.value,
      left: '0',
      top: '0'
    };
    if (!floatingElement.value) {
      return initialStyles;
    }
    const xVal = roundByDPR(floatingElement.value, x.value);
    const yVal = roundByDPR(floatingElement.value, y.value);
    if (transformOption.value) {
      return {
        ...initialStyles,
        transform: "translate(" + xVal + "px, " + yVal + "px)",
        ...(getDPR(floatingElement.value) >= 1.5 && {
          willChange: 'transform'
        })
      };
    }
    return {
      position: strategy.value,
      left: xVal + "px",
      top: yVal + "px"
    };
  });
  let whileElementsMountedCleanup;
  function update() {
    if (referenceElement.value == null || floatingElement.value == null) {
      return;
    }
    computePosition(referenceElement.value, floatingElement.value, {
      middleware: middlewareOption.value,
      placement: placementOption.value,
      strategy: strategyOption.value
    }).then(position => {
      x.value = position.x;
      y.value = position.y;
      strategy.value = position.strategy;
      placement.value = position.placement;
      middlewareData.value = position.middlewareData;
      isPositioned.value = true;
    });
  }
  function cleanup() {
    if (typeof whileElementsMountedCleanup === 'function') {
      whileElementsMountedCleanup();
      whileElementsMountedCleanup = undefined;
    }
  }
  function attach() {
    cleanup();
    if (whileElementsMountedOption === undefined) {
      update();
      return;
    }
    if (referenceElement.value != null && floatingElement.value != null) {
      whileElementsMountedCleanup = whileElementsMountedOption(referenceElement.value, floatingElement.value, update);
      return;
    }
  }
  function reset() {
    if (!openOption.value) {
      isPositioned.value = false;
    }
  }
  watch([middlewareOption, placementOption, strategyOption], update, {
    flush: 'sync'
  });
  watch([referenceElement, floatingElement], attach, {
    flush: 'sync'
  });
  watch(openOption, reset, {
    flush: 'sync'
  });
  if (getCurrentScope()) {
    onScopeDispose(cleanup);
  }
  return {
    x: shallowReadonly(x),
    y: shallowReadonly(y),
    strategy: shallowReadonly(strategy),
    placement: shallowReadonly(placement),
    middlewareData: shallowReadonly(middlewareData),
    isPositioned: shallowReadonly(isPositioned),
    floatingStyles,
    update
  };
}

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "DialogImport",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    id: {}
  },
  emits: ["close", "onImport"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const file = ref("");
    const status = useTemplateRef("status");
    function close() {
      file.value = "";
      status.value?.close();
      emit("close");
    }
    async function importLineage() {
      if (!status.value) return;
      try {
        const importedTree = await dragonSchema.json().validate(file.value);
        emit("onImport", Lineage(importedTree).tree);
        return true;
      } catch {
        status.value.error(
          `Error reading export code. JSON is possibly malformed.`
        );
      }
      return false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BaseDialog, mergeProps({
        id: _ctx.id,
        open: _ctx.open,
        onClose: close
      }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Import lineage`);
          } else {
            return [
              createTextVNode("Import lineage")
            ];
          }
        }),
        footer: withCtx(({ dialog }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="dialog-footer-button"${_scopeId}> Import </button>`);
          } else {
            return [
              createVNode("button", {
                class: "dialog-footer-button",
                onClick: async () => {
                  if (await importLineage()) {
                    dialog.close();
                  }
                }
              }, " Import ", 8, ["onClick"])
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
            _push2(`<div class="flex flex-col"${_scopeId}><p${_scopeId}>Paste the export text and click &#39;import&#39;.</p><p${_scopeId}> If you have a lineage in progress, importing a new lineage will overwrite it. </p></div>`);
            _push2(ssrRenderComponent(InputTextbox, {
              modelValue: file.value,
              "onUpdate:modelValue": ($event) => file.value = $event,
              autofocus: "",
              placeholder: "Paste your import text here",
              type: "textarea"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(FeedbackPanel, {
                ref_key: "status",
                ref: status,
                "global-settings": { showDismiss: false }
              }, null, 512),
              createVNode("div", { class: "flex flex-col" }, [
                createVNode("p", null, "Paste the export text and click 'import'."),
                createVNode("p", null, " If you have a lineage in progress, importing a new lineage will overwrite it. ")
              ]),
              createVNode(InputTextbox, {
                modelValue: file.value,
                "onUpdate:modelValue": ($event) => file.value = $event,
                autofocus: "",
                placeholder: "Paste your import text here",
                type: "textarea"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DialogImport.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const DialogImport = Object.assign(_sfc_main$8, { __name: "DialogImport" });
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "ToolbarDropDownMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const button = ref();
    const menu = ref();
    const open = ref(false);
    const { floatingStyles } = useFloating(button, menu, {
      strategy: "fixed",
      transform: true,
      whileElementsMounted: autoUpdate,
      placement: "bottom-start",
      middleware: [
        flip({
          fallbackPlacements: [
            "bottom-end",
            "bottom",
            "top-end",
            "top",
            "right",
            "left"
          ]
        })
      ]
    });
    const { activate, deactivate } = useFocusTrap(menu, {
      clickOutsideDeactivates: true,
      onActivate() {
        open.value = true;
      },
      onDeactivate() {
        open.value = false;
      },
      isKeyBackward(e) {
        return e.key === "ArrowUp";
      },
      isKeyForward(e) {
        return e.key === "ArrowDown";
      }
    });
    watch(open, async (val) => {
      await nextTick();
      if (val) {
        activate();
      } else {
        deactivate();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(ToolbarButton, mergeProps({
        ref_key: "button",
        ref: button,
        "aria-haspopup": "true",
        "aria-expanded": open.value,
        class: { selected: open.value }
      }, _ctx.$attrs, {
        onClick: ($event) => open.value = true
      }), null, _parent));
      ssrRenderTeleport(_push, (_push2) => {
        if (open.value) {
          _push2(`<div style="${ssrRenderStyle(unref(floatingStyles))}" role="menu" class="menu"${ssrRenderAttr("aria-hidden", !open.value)} data-v-7b6fe297>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ToolbarDropDownMenu.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const ToolbarDropDownMenu = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$7, [["__scopeId", "data-v-7b6fe297"]]), { __name: "ToolbarDropDownMenu" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ToolbarDropDownMenuItem",
  __ssrInlineRender: true,
  props: {
    as: { default: "button" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.as), mergeProps({
        type: _ctx.as === "button" ? "button" : null
      }, _ctx.$attrs, {
        class: "menu-item",
        role: "menuitem"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ToolbarDropDownMenuItem.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ToolbarDropDownMenuItem = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$6, [["__scopeId", "data-v-d349a1b8"]]), { __name: "ToolbarDropDownMenuItem" });
const _sfc_main$5 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "group" }, _attrs))} data-v-212fbbdf><div class="buttons" data-v-212fbbdf>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
  if (_ctx.$slots.legend) {
    _push(`<span class="legend" data-v-212fbbdf>`);
    ssrRenderSlot(_ctx.$slots, "legend", {}, null, _push, _parent);
    _push(`</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ToolbarGroup.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const ToolbarGroup = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-212fbbdf"]]), { __name: "ToolbarGroup" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "LineageBuilderToolbar",
  __ssrInlineRender: true,
  props: {
    config: {
      type: Object,
      required: true
    },
    tree: {
      type: Object,
      required: true
    }
  },
  emits: ["addParents", "switchParents", "unselectAll", "displayNames", "displayCodes", "randomizeLabels", "deleteAncestors", "importTree", "changeBreed", "selectCriteria", "fullscreen", "undo", "redo", "updateConfig"],
  setup(__props, { emit: __emit }) {
    const toolbar = ref();
    const breedSelector = ref();
    const selectionToolsScrollArea = ref();
    const hideSelectionToolsNavButtons = ref(false);
    ref(false);
    const appStore = useAppStore();
    useResizeObserver(selectionToolsScrollArea, (entries) => {
      const entry = entries[0];
      hideSelectionToolsNavButtons.value = entry.target.clientWidth === selectionToolsScrollArea.value.scrollWidth;
    });
    const generalFunctions = reactive(
      [
        {
          title: "Export dragon",
          icon: "save",
          label: "Export",
          click: () => dialogs.showExportDialog = true
        },
        {
          title: "Import dragon",
          icon: "file-code",
          label: "Import",
          click: () => dialogs.showImportDialog = true
        },
        {
          title: "Get Link",
          icon: "link",
          label: "Get Link",
          click: () => dialogs.showGenerateDialog = true
        },
        {
          title: "Toggle fullscreen",
          icon: "maximize",
          label: "Fullscreen",
          click: () => emit("fullscreen")
        },
        {
          title: "Undo",
          icon: "undo",
          label: "Undo",
          click: () => emit("undo"),
          disabled: computed(() => !appStore.treeHistory.canUndo)
        },
        {
          title: "Redo",
          icon: "redo",
          label: "Redo",
          click: () => emit("redo"),
          disabled: computed(() => !appStore.treeHistory.canRedo)
        }
        // convert the string names to actual font awesome props
      ].map((button) => convertToToolbarButtonProps(button, "2x"))
    );
    const selectionActions = reactive(
      [
        {
          name: "Labels",
          buttons: [
            {
              title: "Show names",
              icon: "font",
              label: "Names",
              click: () => emit("displayNames")
            },
            {
              title: "Display codes",
              icon: "italic",
              label: "Codes",
              click: () => emit("displayCodes")
            },
            {
              title: "Randomise visible label",
              icon: "random",
              label: "Randomise label",
              click: () => emit("randomizeLabels")
            }
          ]
        },
        {
          name: "Parents",
          buttons: [
            {
              title: "Delete Parents and Ancestors",
              icon: "minus",
              label: "Delete Parents",
              click: () => emit("deleteAncestors")
            },
            {
              title: "Add parents",
              icon: "arrow-right",
              label: "Add parents",
              click: () => emit("addParents")
            },
            {
              title: "Switch parents",
              icon: "sync-alt",
              label: "switch parents",
              click: () => emit("switchParents")
            }
          ]
        }
      ].map((group) => ({
        name: group.name,
        buttons: group.buttons.map(
          (button) => convertToToolbarButtonProps(button, "1x")
        )
      }))
    );
    const selectionOptions = reactive([
      { label: "All with code", key: "display", criteria: 1 },
      { label: "All with name", key: "display", criteria: 0 },
      { label: "All with placeholder", key: "breed", criteria: "Placeholder" }
    ]);
    const dialogs = reactive({
      showImportDialog: false,
      showExportDialog: false,
      showGenerateDialog: false
    });
    const emit = __emit;
    const treeSelectedContains = (handler) => {
      let male = false, female = false;
      handler.every((dragon) => {
        if (!dragon.selected) return;
        if (dragon.gender === "m") male = true;
        else if (dragon.gender === "f") female = true;
      });
      return { male, female };
    };
    const selectedBreed = ref(placeholder.name);
    const itemsSelected = computed(() => appStore.selectionCount);
    const availableBreeds = computed(() => {
      if (!itemsSelected.value) return [];
      const { male, female } = treeSelectedContains(appStore.activeLineage);
      const breedTable = filterBreedsByTagsWith(
        listOfBreeds,
        tagsFromModel(tagStore)
      );
      const getNames = (breed) => breed.name;
      const maleBreeds = malePortraits.map(getNames);
      const femaleBreeds = femalePortraits.map(getNames);
      let filter;
      const hasBreed = (list, name) => list.includes(name);
      if (male && female) {
        filter = (breed) => hasBreed(maleBreeds, breed.name) && hasBreed(femaleBreeds, breed.name);
      } else {
        filter = male ? (breed) => hasBreed(maleBreeds, breed.name) : (breed) => hasBreed(femaleBreeds, breed.name);
      }
      return breedTable.filter(filter).map((breed) => breed.name);
    });
    function importLineage(tree) {
      emit("importTree", tree);
    }
    function updateConfig(configurationName, newValue) {
      emit("updateConfig", configurationName, newValue);
    }
    function convertToToolbarButtonProps(button, size = "2x") {
      return {
        ...button,
        title: capitalise(button.title),
        label: capitalise(button.label),
        icon: {
          size,
          icon: button.icon
        }
      };
    }
    function capitalise(string) {
      return string.split(" ").map((substr) => substr[0].toUpperCase() + substr.slice(1)).join(" ");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_dragscroll = resolveDirective("dragscroll");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(DialogExport, {
        id: "dialog-export",
        open: dialogs.showExportDialog,
        tree: __props.tree,
        onClose: ($event) => dialogs.showExportDialog = false
      }, null, _parent));
      _push(ssrRenderComponent(DialogImport, {
        id: "dialog-import",
        open: dialogs.showImportDialog,
        onClose: ($event) => dialogs.showImportDialog = false,
        onOnImport: importLineage
      }, null, _parent));
      _push(ssrRenderComponent(DialogGenerate, {
        id: "dialog-generate",
        open: dialogs.showGenerateDialog,
        tree: __props.tree,
        onClose: ($event) => dialogs.showGenerateDialog = false
      }, null, _parent));
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "toolbar",
        ref: toolbar,
        class: "toolbar",
        role: "toolbar"
      }, _ctx.$attrs))} data-v-4ffaa3f3><div class="settings" aria-label="Settings toolbar" data-v-4ffaa3f3><input id="show-interface"${ssrIncludeBooleanAttr(__props.config.showInterface) ? " checked" : ""} class="item" type="checkbox" data-v-4ffaa3f3><label for="show-interface" data-v-4ffaa3f3>Show controls</label><input id="show-labels"${ssrIncludeBooleanAttr(__props.config.showLabels) ? " checked" : ""} class="item" type="checkbox" data-v-4ffaa3f3><label for="show-labels" data-v-4ffaa3f3>Show labels</label></div><div class="functions" aria-label="Functions toolbar" data-v-4ffaa3f3><!--[-->`);
      ssrRenderList(generalFunctions, (button) => {
        _push(ssrRenderComponent(ToolbarButton, mergeProps({
          key: button.label
        }, { ref_for: true }, button, {
          onClick: button.click
        }), null, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(ToolbarDropDownMenu, {
        icon: { icon: "cog", size: "2x" },
        title: "Settings",
        label: "Settings"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(ToolbarDropDownMenuItem, {
              as: "div",
              onClick: ($event) => updateConfig("showInterface", !__props.config.showInterface)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="show-interface2"${ssrIncludeBooleanAttr(__props.config.showInterface) ? " checked" : ""} type="checkbox" data-v-4ffaa3f3${_scopeId2}><label for="show-interface2" data-v-4ffaa3f3${_scopeId2}>Show controls</label>`);
                } else {
                  return [
                    createVNode("input", {
                      id: "show-interface2",
                      checked: __props.config.showInterface,
                      type: "checkbox"
                    }, null, 8, ["checked"]),
                    createVNode("label", {
                      for: "show-interface2",
                      onClick: withModifiers(() => {
                      }, ["prevent"])
                    }, "Show controls", 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(ToolbarDropDownMenuItem, {
              as: "div",
              onClick: ($event) => updateConfig("showLabels", !__props.config.showLabels)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input id="show-labels2"${ssrIncludeBooleanAttr(__props.config.showLabels) ? " checked" : ""} type="checkbox" data-v-4ffaa3f3${_scopeId2}><label for="show-labels2" data-v-4ffaa3f3${_scopeId2}>Show labels</label>`);
                } else {
                  return [
                    createVNode("input", {
                      id: "show-labels2",
                      checked: __props.config.showLabels,
                      type: "checkbox"
                    }, null, 8, ["checked"]),
                    createVNode("label", {
                      for: "show-labels2",
                      onClick: withModifiers(() => {
                      }, ["prevent"])
                    }, "Show labels", 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(ToolbarDropDownMenuItem, {
                as: "div",
                onClick: ($event) => updateConfig("showInterface", !__props.config.showInterface)
              }, {
                default: withCtx(() => [
                  createVNode("input", {
                    id: "show-interface2",
                    checked: __props.config.showInterface,
                    type: "checkbox"
                  }, null, 8, ["checked"]),
                  createVNode("label", {
                    for: "show-interface2",
                    onClick: withModifiers(() => {
                    }, ["prevent"])
                  }, "Show controls", 8, ["onClick"])
                ]),
                _: 1
              }, 8, ["onClick"]),
              createVNode(ToolbarDropDownMenuItem, {
                as: "div",
                onClick: ($event) => updateConfig("showLabels", !__props.config.showLabels)
              }, {
                default: withCtx(() => [
                  createVNode("input", {
                    id: "show-labels2",
                    checked: __props.config.showLabels,
                    type: "checkbox"
                  }, null, 8, ["checked"]),
                  createVNode("label", {
                    for: "show-labels2",
                    onClick: withModifiers(() => {
                    }, ["prevent"])
                  }, "Show labels", 8, ["onClick"])
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="${ssrRenderClass([{
        "full-width": hideSelectionToolsNavButtons.value
      }, "selection-tools"])}" aria-label="Selection toolbar" data-v-4ffaa3f3><button class="${ssrRenderClass([{
        invisible: hideSelectionToolsNavButtons.value
      }, "selection-nav left"])}" type="button" title="Scroll to start" data-v-4ffaa3f3></button><div${ssrRenderAttrs(mergeProps({
        ref_key: "selectionToolsScrollArea",
        ref: selectionToolsScrollArea,
        class: "selection-scrollable"
      }, ssrGetDirectiveProps(_ctx, _directive_dragscroll, void 0, void 0, { x: true })))} data-v-4ffaa3f3>`);
      _push(ssrRenderComponent(ToolbarGroup, null, {
        legend: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Select`);
          } else {
            return [
              createTextVNode("Select")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(ToolbarButton, {
              title: "Select all males",
              icon: { icon: "mars" },
              onClick: ($event) => emit("selectCriteria", "gender", "m")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(ToolbarButton, {
              icon: { icon: "venus" },
              title: "Select all females",
              onClick: ($event) => emit("selectCriteria", "gender", "f")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(ToolbarDropDownMenu, {
              title: "More options",
              icon: { icon: "caret-down" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(selectionOptions, (option) => {
                    _push3(ssrRenderComponent(ToolbarDropDownMenuItem, {
                      key: option.key,
                      onClick: ($event) => emit("selectCriteria", option.key, option.criteria)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(option.label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(option.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(selectionOptions, (option) => {
                      return openBlock(), createBlock(ToolbarDropDownMenuItem, {
                        key: option.key,
                        onClick: ($event) => emit("selectCriteria", option.key, option.criteria)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(option.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(ToolbarButton, {
              title: "Unselect all",
              icon: { icon: "times" },
              disabled: itemsSelected.value === 0,
              onClick: ($event) => emit("unselectAll")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(ToolbarButton, {
                title: "Select all males",
                icon: { icon: "mars" },
                onClick: ($event) => emit("selectCriteria", "gender", "m")
              }, null, 8, ["onClick"]),
              createVNode(ToolbarButton, {
                icon: { icon: "venus" },
                title: "Select all females",
                onClick: ($event) => emit("selectCriteria", "gender", "f")
              }, null, 8, ["onClick"]),
              createVNode(ToolbarDropDownMenu, {
                title: "More options",
                icon: { icon: "caret-down" }
              }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(selectionOptions, (option) => {
                    return openBlock(), createBlock(ToolbarDropDownMenuItem, {
                      key: option.key,
                      onClick: ($event) => emit("selectCriteria", option.key, option.criteria)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(option.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["onClick"]);
                  }), 128))
                ]),
                _: 1
              }),
              createVNode(ToolbarButton, {
                title: "Unselect all",
                icon: { icon: "times" },
                disabled: itemsSelected.value === 0,
                onClick: ($event) => emit("unselectAll")
              }, null, 8, ["disabled", "onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ToolbarGroup, null, {
        legend: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Breed`);
          } else {
            return [
              createTextVNode("Breed")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="selection-apply-breed-container" data-v-4ffaa3f3${_scopeId}><select id="selection-apply-breed" title="Apply selected breed" class="breed-dropdown interactive" data-no-dragscroll${ssrIncludeBooleanAttr(itemsSelected.value === 0) ? " disabled" : ""} aria-labelledby="selection-apply-breed selection-apply-count " data-v-4ffaa3f3${_scopeId}><!--[-->`);
            ssrRenderList(availableBreeds.value, (breed) => {
              _push2(`<option data-v-4ffaa3f3${ssrIncludeBooleanAttr(Array.isArray(selectedBreed.value) ? ssrLooseContain(selectedBreed.value, null) : ssrLooseEqual(selectedBreed.value, null)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(breed)}</option>`);
            });
            _push2(`<!--]--></select><span id="selection-apply-count" title="Dragons selected" class="count" data-v-4ffaa3f3${_scopeId}>${ssrInterpolate(itemsSelected.value)}<span class="sr-only" data-v-4ffaa3f3${_scopeId}>selected</span></span></div>`);
          } else {
            return [
              createVNode("div", { class: "selection-apply-breed-container" }, [
                withDirectives(createVNode("select", {
                  id: "selection-apply-breed",
                  ref_key: "breedSelector",
                  ref: breedSelector,
                  "onUpdate:modelValue": ($event) => selectedBreed.value = $event,
                  title: "Apply selected breed",
                  class: "breed-dropdown interactive",
                  "data-no-dragscroll": "",
                  disabled: itemsSelected.value === 0,
                  "aria-labelledby": "selection-apply-breed selection-apply-count ",
                  onChange: ($event) => emit("changeBreed", selectedBreed.value)
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(availableBreeds.value, (breed) => {
                    return openBlock(), createBlock("option", { key: breed }, toDisplayString(breed), 1);
                  }), 128))
                ], 40, ["onUpdate:modelValue", "disabled", "onChange"]), [
                  [vModelSelect, selectedBreed.value]
                ]),
                createVNode("span", {
                  id: "selection-apply-count",
                  title: "Dragons selected",
                  class: "count",
                  onClick: ($event) => breedSelector.value?.focus()
                }, [
                  createTextVNode(toDisplayString(itemsSelected.value), 1),
                  createVNode("span", { class: "sr-only" }, "selected")
                ], 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(selectionActions, (group) => {
        _push(ssrRenderComponent(ToolbarGroup, {
          key: group.name
        }, {
          legend: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(group.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(group.name), 1)
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(group.buttons, (button) => {
                _push2(ssrRenderComponent(ToolbarButton, mergeProps({
                  key: button.label
                }, { ref_for: true }, button, {
                  disabled: itemsSelected.value === 0,
                  onClick: button.click
                }), null, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(group.buttons, (button) => {
                  return openBlock(), createBlock(ToolbarButton, mergeProps({
                    key: button.label
                  }, { ref_for: true }, button, {
                    disabled: itemsSelected.value === 0,
                    onClick: button.click
                  }), null, 16, ["disabled", "onClick"]);
                }), 128))
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><button type="button" title="Scroll to end" class="${ssrRenderClass([{
        invisible: hideSelectionToolsNavButtons.value
      }, "selection-nav right"])}" data-v-4ffaa3f3></button></div></div><!--]-->`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LineageBuilderToolbar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const LineageBuilderToolbar = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-4ffaa3f3"]]), { __name: "LineageBuilderToolbar" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DialogBreedSelectorWrapper",
  __ssrInlineRender: true,
  setup(__props) {
    const breedSelectorDialog = useBreedSelector();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
      _push(`<dialog${ssrRenderAttrs(mergeProps({
        id: "breed-selector-wrapper",
        ref: unref(breedSelectorDialog).dialogRef,
        class: "dialog no-transition",
        "aria-labelledby": "dialog-breed-selector-wrapper"
      }, _attrs))} data-v-83d610bf><div class="dialog-inner" data-v-83d610bf><header class="dialog-header" data-v-83d610bf><h1 id="dialog-breed-selector-wrapper" class="dialog-header-title" data-v-83d610bf>`);
      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
        _push(`Choose a breed`);
      }, _push, _parent);
      _push(`</h1><div class="dialog-buttons" data-v-83d610bf><button class="button close-button" type="button" title="Close" data-v-83d610bf>`);
      _push(ssrRenderComponent(_component_FontAwesomeIcon, {
        size: "2x",
        icon: "times"
      }, null, _parent));
      _push(`</button></div></header><main class="dialog-main" data-v-83d610bf>`);
      ssrRenderSlot(_ctx.$slots, "content", {}, null, _push, _parent);
      _push(`</main></div></dialog>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DialogBreedSelectorWrapper.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const DialogBreedSelectorWrapper = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-83d610bf"]]), { __name: "DialogBreedSelectorWrapper" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DialogBreedSelector",
  __ssrInlineRender: true,
  emits: ["breedSelected"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const searchString = useSessionStorage("search", "");
    const mateSearchEl = useTemplateRef("mateSearchEl");
    const resultsEl = useTemplateRef("resultsEl");
    const breedSelectorDialog = useBreedSelector();
    onStartTyping(() => {
      if (!mateSearchEl.value) return;
      if ((void 0).activeElement !== mateSearchEl.value.$el)
        mateSearchEl.value.$el.focus();
    });
    watch(breedSelectorDialog.autofocus, async (value) => {
      await nextTick();
      if (value && mateSearchEl.value) {
        mateSearchEl.value.$el.focus();
      }
    });
    function breedSelected(breed) {
      const openTime = parseInt(
        breedSelectorDialog.dialogRef.value?.dataset.openTime ?? "0"
      );
      if (Date.now() - openTime < 250) {
        return;
      }
      breedSelectorDialog.handleBreedSelected(breed);
      emit("breedSelected", breed);
    }
    async function jumpToFirstResult() {
      await nextTick();
      if (resultsEl.value) {
        resultsEl.value.querySelector(
          "[tabindex='-1'], .breed-entry-button, .grid-cell"
        )?.focus();
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(DialogBreedSelectorWrapper, mergeProps({
        onClose: ($event) => unref(breedSelectorDialog).hide()
      }, _attrs), {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form role="search" data-v-94394480${_scopeId}><h2 class="sr-only" data-v-94394480${_scopeId}>Filtering</h2><div id="filtering" data-v-94394480${_scopeId}>`);
            _push2(ssrRenderComponent(BreedSearch, {
              id: "results-search",
              ref_key: "mateSearchEl",
              ref: mateSearchEl,
              modelValue: unref(searchString),
              "onUpdate:modelValue": ($event) => isRef(searchString) ? searchString.value = $event : null,
              placeholder: "Search",
              enterkeyhint: "search"
            }, null, _parent2, _scopeId));
            _push2(`<label for="results-search" class="sr-only" data-v-94394480${_scopeId}> Search </label><label for="applied-filters" class="sr-only" data-v-94394480${_scopeId}> Filters </label>`);
            _push2(ssrRenderComponent(BreedListFilterDropdown, {
              id: "applied-filters",
              placeholder: "Filters",
              container: "#breed-selector-wrapper"
            }, null, _parent2, _scopeId));
            _push2(`</div></form><section id="breeds" data-v-94394480${_scopeId}><h2 class="sr-only" data-v-94394480${_scopeId}>Results</h2>`);
            _push2(ssrRenderComponent(BreedListFiltered, {
              style: unref(breedSelectorDialog).forGender.value === "m" ? null : { display: "none" },
              id: "filtered-breeds",
              search: unref(searchString),
              breeds: unref(getTable)("m"),
              tags: unref(chosenTags),
              "no-results-text": "There are no breeds that match this criteria.",
              onBreedSelected: breedSelected
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(BreedListFiltered, {
              style: unref(breedSelectorDialog).forGender.value === "f" ? null : { display: "none" },
              id: "filtered-breeds",
              search: unref(searchString),
              breeds: unref(getTable)("f"),
              tags: unref(chosenTags),
              "no-results-text": "There are no breeds that match this criteria.",
              onBreedSelected: breedSelected
            }, null, _parent2, _scopeId));
            _push2(`</section>`);
          } else {
            return [
              createVNode("form", {
                role: "search",
                onSubmit: withModifiers(($event) => jumpToFirstResult(), ["prevent"]),
                onKeydown: withKeys(withModifiers(($event) => jumpToFirstResult(), ["prevent"]), ["enter"])
              }, [
                createVNode("h2", { class: "sr-only" }, "Filtering"),
                createVNode("div", { id: "filtering" }, [
                  createVNode(BreedSearch, {
                    id: "results-search",
                    ref_key: "mateSearchEl",
                    ref: mateSearchEl,
                    modelValue: unref(searchString),
                    "onUpdate:modelValue": ($event) => isRef(searchString) ? searchString.value = $event : null,
                    placeholder: "Search",
                    enterkeyhint: "search"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("label", {
                    for: "results-search",
                    class: "sr-only"
                  }, " Search "),
                  createVNode("label", {
                    for: "applied-filters",
                    class: "sr-only"
                  }, " Filters "),
                  createVNode(BreedListFilterDropdown, {
                    id: "applied-filters",
                    placeholder: "Filters",
                    container: "#breed-selector-wrapper"
                  })
                ])
              ], 40, ["onSubmit", "onKeydown"]),
              createVNode("section", {
                id: "breeds",
                ref_key: "resultsEl",
                ref: resultsEl
              }, [
                createVNode("h2", { class: "sr-only" }, "Results"),
                withDirectives(createVNode(BreedListFiltered, {
                  id: "filtered-breeds",
                  search: unref(searchString),
                  breeds: unref(getTable)("m"),
                  tags: unref(chosenTags),
                  "no-results-text": "There are no breeds that match this criteria.",
                  onBreedSelected: breedSelected
                }, null, 8, ["search", "breeds", "tags"]), [
                  [vShow, unref(breedSelectorDialog).forGender.value === "m"]
                ]),
                withDirectives(createVNode(BreedListFiltered, {
                  id: "filtered-breeds",
                  search: unref(searchString),
                  breeds: unref(getTable)("f"),
                  tags: unref(chosenTags),
                  "no-results-text": "There are no breeds that match this criteria.",
                  onBreedSelected: breedSelected
                }, null, 8, ["search", "breeds", "tags"]), [
                  [vShow, unref(breedSelectorDialog).forGender.value === "f"]
                ])
              ], 512)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DialogBreedSelector.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DialogBreedSelector = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-94394480"]]), { __name: "DialogBreedSelector" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LineageBuilder",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const appStore = useAppStore();
    const builder = ref(null);
    const fullscreen = useFullscreen(builder);
    const config = reactive({
      showInterface: true,
      showLabels: true,
      disabled: false
    });
    const status = useTemplateRef("status");
    onBeforeRouteLeave(() => {
      appStore.treeHistory.clear();
    });
    function updateTree(callback) {
      appStore.activeTree = appStore.activeLineage.every(callback);
    }
    function applyToSelected(keyOrCallback, value) {
      if (typeof keyOrCallback === "string") {
        const key = keyOrCallback.toString();
        appStore.activeTree = appStore.activeLineage.every((dragon) => {
          if (dragon.selected && key in dragon) dragon[key] = value;
        });
      } else if (typeof keyOrCallback === "function") {
        const callback = keyOrCallback;
        appStore.activeTree = appStore.activeLineage.every((dragon) => {
          if (dragon.selected) callback(dragon);
        });
      }
    }
    function selectionCriteria(keyOrCallback, value) {
      if (typeof keyOrCallback === "string") {
        const key = keyOrCallback.toString();
        selectBy((dragon) => dragon[key] === value);
      } else if (typeof keyOrCallback === "function") {
        const condition = keyOrCallback;
        selectBy(condition);
      }
    }
    function selectionChangeBreed(breedName) {
      updateTree((dragon) => {
        if (dragon.selected) dragon.breed = breedName;
      });
    }
    function selectionDeleteAncestors() {
      applyToSelected("parents", {});
    }
    function selectionAddParents() {
      applyToSelected((dragon) => {
        if (!hasParents(dragon)) {
          dragon.parents = {
            m: DragonBuilder.createWithMetadata({ gender: "m" }),
            f: DragonBuilder.createWithMetadata({ gender: "f" })
          };
        }
      });
    }
    function selectionSwitchParents() {
      applyToSelected((dragon) => {
        if (!hasParents(dragon)) return;
        Object.assign(dragon, Lineage(dragon).switchParents().raw());
      });
    }
    function selectionRandomizeLabels() {
      applyToSelected((dragon) => {
        if (dragon.display === 0) dragon.name = DragonBuilder.generateName();
        else dragon.code = DragonBuilder.generateCode();
      });
    }
    function selectionSwitchLabel(display) {
      applyToSelected("display", display);
    }
    function unselectAll() {
      applyToSelected("selected", false);
    }
    function selectBy(condition) {
      updateTree((dragon) => {
        if (!dragon.selected && condition(dragon)) dragon.selected = true;
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "builder",
        ref: builder,
        class: "builder-container"
      }, _attrs))} data-v-a232de98>`);
      _push(ssrRenderComponent(DialogBreedSelector, null, null, _parent));
      _push(`<div class="constrain-width" data-v-a232de98>`);
      _push(ssrRenderComponent(FeedbackPanel, {
        ref_key: "status",
        ref: status
      }, null, _parent));
      _push(`</div>`);
      if (unref(appStore).activeTree !== null) {
        _push(ssrRenderComponent(LineageView, {
          class: "builder",
          root: unref(appStore).activeTree,
          config,
          onContextmenu: () => false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(appStore).activeTree !== null) {
        _push(ssrRenderComponent(LineageBuilderToolbar, {
          config,
          tree: unref(appStore).activeTree,
          onUpdateConfig: (key, value) => config[key] = value,
          onImportTree: (newTree) => unref(appStore).activeTree = unref(Lineage)(newTree).withMetadata().tree,
          onUnselectAll: unselectAll,
          onChangeBreed: selectionChangeBreed,
          onDisplayNames: ($event) => selectionSwitchLabel(0),
          onDisplayCodes: ($event) => selectionSwitchLabel(1),
          onSelectCriteria: selectionCriteria,
          onRandomizeLabels: selectionRandomizeLabels,
          onDeleteAncestors: selectionDeleteAncestors,
          onAddParents: selectionAddParents,
          onSwitchParents: selectionSwitchParents,
          onFullscreen: unref(fullscreen).toggle,
          onUndo: unref(appStore).treeHistory.undo,
          onRedo: unref(appStore).treeHistory.redo
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LineageBuilder.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const LineageBuilder = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-a232de98"]]), { __name: "LineageBuilder" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Builder",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><h1 class="sr-only">Build</h1>`);
      _push(ssrRenderComponent(LineageBuilder, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Builder.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=Builder-CBCxWP4O.mjs.map
