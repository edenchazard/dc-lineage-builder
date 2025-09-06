import { defineComponent, computed, mergeProps, withCtx, createBlock, createCommentVNode, openBlock, createVNode, readonly, ref, resolveComponent, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrGetDirectiveProps, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, L as Lineage, e as useAppStore, k as hasParents, s as getBreedData, t as breedEntryToPortrait, v as expandGender, w as validateName, x as validateCode, q as useScrollLock, D as DragonBuilder, p as placeholder } from './server.mjs';
import { D as DragonPortrait } from './DragonPortrait-CBnMtC3n.mjs';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { L as LineageWrapper } from './LineageWrapper-FeuYjQv8.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "LineageViewNodeLabel",
  __ssrInlineRender: true,
  props: {
    value: {
      type: String,
      required: true
    },
    display: {
      type: Number,
      required: true
    },
    // determines whether click to edit is enabled
    disabled: {
      type: Boolean,
      default: true
    }
  },
  emits: ["changed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const editing = ref(false);
    const inputEl = ref();
    const classes = computed(() => [props.display === 1 ? "code" : "name"]);
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      if (editing.value) {
        _push(`<textarea${ssrRenderAttrs(_temp0 = mergeProps({
          ref_key: "inputEl",
          ref: inputEl,
          class: ["label-block input", classes.value],
          placeholder: `Enter new ${__props.display === 1 ? "code" : "name"}`,
          value: __props.value,
          spellcheck: "false",
          rows: "1"
        }, _attrs), "textarea")} data-v-95da1f63>${ssrInterpolate("value" in _temp0 ? _temp0.value : "")}</textarea>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["label-block label", classes.value],
          role: "button",
          tabindex: __props.disabled ? -1 : 0
        }, _attrs))} data-v-95da1f63>${ssrInterpolate(__props.display === 1 ? `(${__props.value})` : __props.value)}</div>`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LineageViewNodeLabel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const LineageViewNodeLabel = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-95da1f63"]]), { __name: "LineageViewNodeLabel" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "LineageViewNodeButton",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: "tile-button pointer",
        type: "button",
        title: __props.title
      }, _attrs))} data-v-6fbcd3fd>`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), {
        icon: __props.icon,
        class: "graphic"
      }, null, _parent));
      _push(`</button>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LineageViewNodeButton.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const LineageViewNodeButton = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-6fbcd3fd"]]), { __name: "LineageViewNodeButton" });
const noSelectClass = "long-press-no-select";
let timeout;
let longPressActivated = false;
function prevent(event) {
  event.preventDefault();
}
function isRightMouseButton(e) {
  return e.pointerType === "mouse" && e.button === 2;
}
function clearPress() {
  clearTimeout(timeout);
  longPressActivated = false;
}
const vOnLongPress = {
  beforeMount(el, binding) {
    const {
      // callbacks
      onLongPress,
      onClick,
      onPress,
      // options
      wait = 500,
      disableRightClickMenu
    } = binding.value;
    function handleDown(e) {
      longPressActivated = false;
      if (e instanceof PointerEvent && isRightMouseButton(e)) return;
      timeout = (void 0).setTimeout(() => {
        longPressActivated = true;
        if (onLongPress) {
          onLongPress(e);
        }
      }, wait);
      if (onPress) {
        onPress(e);
      }
    }
    function handleUp(e) {
      if (e instanceof PointerEvent && isRightMouseButton(e)) return;
      clearTimeout(timeout);
      if (!longPressActivated && onClick) {
        setTimeout(() => onClick(e), 20);
      }
    }
    el.addEventListener("pointerdown", handleDown);
    el.addEventListener("pointerup", handleUp);
    el.addEventListener("pointerout", clearPress);
    el.addEventListener("keyup", (e) => {
      if (e.code === "Space") handleUp(e);
    });
    if (disableRightClickMenu) {
      el.addEventListener("contextmenu", prevent);
    }
    el.classList.add(noSelectClass);
  },
  updated(el) {
    el.classList.add(noSelectClass);
  }
  // cleanup
  /*unbind(el){
        el.classList.remove(noSelectClass);
        el.events.forEach(event => el.removeEventListener(event[0], event[1]));
        el.events = null;
    }*/
};
const scrollLockDoc = useScrollLock((void 0).documentElement, false);
const scrollLockBody = useScrollLock((void 0).body, false);
const dialogRef = ref();
const autofocus = ref(false);
const forGender = ref();
let breedSelectedCallback;
function show(options) {
  const _options = {
    autofocus: false,
    breedSelectedCallback: null,
    ...options
  };
  autofocus.value = _options.autofocus;
  forGender.value = _options.forGender;
  breedSelectedCallback = _options.breedSelectedCallback;
  scrollLockDoc.value = scrollLockBody.value = true;
  if (dialogRef.value) {
    dialogRef.value.showModal();
    dialogRef.value.dataset.openTime = Date.now().toString();
  }
}
function hide() {
  const results = dialogRef.value?.querySelector(".results");
  if (results) {
    results.scrollTop = 0;
  }
  const tabIndexes = dialogRef.value?.querySelectorAll(
    "[data-roving-tabindex]"
  );
  tabIndexes?.forEach((el) => {
    el.setAttribute("tabindex", "-1");
  });
  tabIndexes?.[0]?.setAttribute("tabindex", "0");
  autofocus.value = false;
  if (dialogRef.value) {
    dialogRef.value.close();
    dialogRef.value.dataset.openTime = "";
  }
  breedSelectedCallback = null;
  scrollLockDoc.value = scrollLockBody.value = false;
}
function handleBreedSelected(breed) {
  if (breedSelectedCallback) {
    breedSelectedCallback(breed);
  }
}
function useBreedSelector() {
  return {
    dialogRef,
    autofocus: readonly(autofocus),
    forGender: readonly(forGender),
    show,
    hide,
    handleBreedSelected
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LineageViewNode",
  __ssrInlineRender: true,
  props: {
    // Dragon properties
    data: {
      type: Object,
      required: true
    },
    // Whether to disable the click
    disabled: {
      type: Boolean,
      default: true,
      required: false
    },
    // How many gens is this?
    nodesFromRoot: {
      type: Number,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const ls = localStorage;
    const appStore = useAppStore();
    const breedSelectorDialog = useBreedSelector();
    const hasAncestry = computed(() => hasParents(props.data));
    const getImage = computed(() => {
      const entry = getBreedData(props.data.breed);
      const portrait = breedEntryToPortrait(entry, expandGender(props.data.gender));
      return portrait;
    });
    const problems = computed(() => {
      const errs = [];
      if (!validateName(props.data.name)) {
        errs.push("Name is invalid.");
      }
      if (!validateCode(props.data.code)) {
        errs.push("Code is invalid.");
      }
      return errs.join("");
    });
    function switchGender() {
      const invertedGender = props.data.gender === "f" ? "m" : "f";
      if (props.data.breed === "Placeholder") {
        props.data.gender = invertedGender;
        props.data.breed = placeholder.name;
      } else {
        const entry = getBreedData(props.data.breed);
        if (!entry) return;
        if (!entry.genderOnly) {
          props.data.gender = invertedGender;
        } else {
          props.data.gender = invertedGender;
          props.data.breed = placeholder.name;
        }
      }
    }
    function changeBreed(e) {
      breedSelectorDialog.hide();
      props.data.breed = e.name;
    }
    function pasteBranch() {
      const clipboard = ls.getItem("clipboard");
      if (clipboard === null) return;
      props.data.parents = JSON.parse(clipboard);
    }
    function switchParents() {
      Object.assign(props.data, Lineage(props.data).switchParents().raw());
    }
    function copyBranch() {
      if (!hasAncestry.value || !hasParents(props.data)) return;
      ls.setItem(
        "clipboard",
        JSON.stringify({
          m: Lineage(props.data.parents.m).withoutMetadata().raw(),
          f: Lineage(props.data.parents.f).withoutMetadata().raw()
        })
      );
    }
    function removeDescendants() {
      appStore.activeTree = props.data;
    }
    function addDescendant() {
      appStore.addDescendant();
    }
    function addAncestors() {
      props.data.parents = {
        m: DragonBuilder.createWithMetadata({ gender: "m" }),
        f: DragonBuilder.createWithMetadata({ gender: "f" })
      };
    }
    function deleteAncestors() {
      props.data.parents = {};
    }
    function labelChanged(value) {
      const attr = props.data.display === 1 ? "code" : "name";
      props.data[attr] = value;
    }
    function switchLabel() {
      props.data.display = props.data.display === 1 ? 0 : 1;
    }
    function handleLongPress() {
      if (props.disabled) return;
      if (appStore.selectionCount === 0) {
        if (!props.data.selected) {
          props.data.selected = true;
        }
      } else {
        props.data.selected = !props.data.selected;
      }
    }
    function handleClick(e) {
      if (props.disabled) return;
      if (appStore.selectionCount > 0) {
        props.data.selected = !props.data.selected;
      } else {
        breedSelectorDialog.show({
          // if the keyboard was used to open the dialog, it's relatively safe
          // to assume they'll want to immediately use the search
          // control too.
          autofocus: e instanceof KeyboardEvent && e.code === "Space",
          forGender: props.data.gender,
          breedSelectedCallback: (e2) => changeBreed(e2)
        });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FontAwesomeIcon = resolveComponent("FontAwesomeIcon");
      const _component_LineageViewNode = LineageViewNode;
      _push(`<li${ssrRenderAttrs(mergeProps({ class: "tile-container" }, _attrs))} data-v-ca57003b><div class="tile" data-v-ca57003b>`);
      if (__props.nodesFromRoot === 0) {
        _push(ssrRenderComponent(LineageViewNodeButton, {
          class: "tile-button-left tile-button-add-desc",
          title: "Add descendant",
          icon: "arrow-left",
          onClick: addDescendant
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.nodesFromRoot > 0) {
        _push(ssrRenderComponent(LineageViewNodeButton, {
          class: "tile-button-left tile-button-remove-desc",
          title: "Remove descendants",
          icon: "cut",
          onClick: removeDescendants
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: "dragon-breed-picker-button pointer",
        disabled: __props.disabled,
        type: "button"
      }, ssrGetDirectiveProps(_ctx, unref(vOnLongPress), {
        wait: 300,
        onClick: handleClick,
        onLongPress: handleLongPress
      })))} data-v-ca57003b>`);
      _push(ssrRenderComponent(DragonPortrait, {
        data: getImage.value,
        class: {
          selected: __props.data.selected
        }
      }, null, _parent));
      _push(`</button>`);
      _push(ssrRenderComponent(_component_FontAwesomeIcon, {
        icon: "warning",
        class: [{ visible: problems.value.length > 0 }, "label-warning"],
        title: problems.value,
        "aria-label": problems.value
      }, null, _parent));
      _push(`<div class="tile-button-right" data-v-ca57003b>`);
      if (hasAncestry.value) {
        _push(ssrRenderComponent(LineageViewNodeButton, {
          class: "switch",
          title: "Switch parents",
          icon: "sync-alt",
          onClick: switchParents
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (hasAncestry.value) {
        _push(ssrRenderComponent(LineageViewNodeButton, {
          title: "Remove ancestors",
          icon: "minus",
          onClick: deleteAncestors
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(LineageViewNodeButton, {
          class: "tile-button-right",
          title: "Add ancestors",
          icon: "arrow-right",
          onClick: addAncestors
        }, null, _parent));
      }
      _push(`</div>`);
      _push(ssrRenderComponent(LineageViewNodeLabel, {
        value: __props.data.display === 1 ? __props.data.code : __props.data.name,
        display: __props.data.display,
        disabled: __props.disabled,
        onChanged: labelChanged
      }, null, _parent));
      _push(`<div class="tile-bottom-controls tile-button-group" data-v-ca57003b>`);
      if (__props.nodesFromRoot === 0 && __props.data.gender === "m") {
        _push(ssrRenderComponent(LineageViewNodeButton, {
          title: "Switch gender to female",
          icon: "mars",
          onClick: switchGender
        }, null, _parent));
      } else if (__props.nodesFromRoot === 0 && __props.data.gender === "f") {
        _push(ssrRenderComponent(LineageViewNodeButton, {
          title: "Switch gender to male",
          icon: "venus",
          onClick: switchGender
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(LineageViewNodeButton, {
        class: "switchLabel",
        title: "Switch label",
        icon: "font",
        onClick: switchLabel
      }, null, _parent));
      if (hasAncestry.value) {
        _push(ssrRenderComponent(LineageViewNodeButton, {
          title: "Copy ancestors",
          icon: "clone",
          onClick: copyBranch
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(LineageViewNodeButton, {
        title: "Paste ancestors",
        icon: "paste",
        onClick: pasteBranch
      }, null, _parent));
      _push(`</div></div>`);
      if (hasAncestry.value) {
        _push(`<ul class="tile-parents" data-v-ca57003b>`);
        _push(ssrRenderComponent(_component_LineageViewNode, {
          data: __props.data.parents.m,
          "nodes-from-root": __props.nodesFromRoot + 1,
          disabled: __props.disabled
        }, null, _parent));
        _push(ssrRenderComponent(_component_LineageViewNode, {
          data: __props.data.parents.f,
          "nodes-from-root": __props.nodesFromRoot + 1,
          disabled: __props.disabled
        }, null, _parent));
        _push(`</ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</li>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LineageViewNode.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const LineageViewNode = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-ca57003b"]]), { __name: "LineageViewNode" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LineageView",
  __ssrInlineRender: true,
  props: {
    root: {
      type: Object,
      required: true,
      default: null
    },
    config: {
      type: Object,
      required: false,
      default: () => ({
        showLabels: true,
        showInterface: false,
        disabled: true
      })
    }
  },
  setup(__props) {
    const props = __props;
    const generations = computed(
      () => props.root ? Lineage(props.root).generations() : 0
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(LineageWrapper, mergeProps({
        generations: generations.value,
        "data-show-labels": __props.config.showLabels,
        "data-show-editor-interface": __props.config.showInterface
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.root !== null) {
              _push2(`<ul class="lineage-root" data-v-8c1378ea${_scopeId}>`);
              _push2(ssrRenderComponent(LineageViewNode, {
                data: __props.root,
                "nodes-from-root": 0,
                disabled: __props.config.disabled
              }, null, _parent2, _scopeId));
              _push2(`</ul>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.root !== null ? (openBlock(), createBlock("ul", {
                key: 0,
                class: "lineage-root"
              }, [
                createVNode(LineageViewNode, {
                  data: __props.root,
                  "nodes-from-root": 0,
                  disabled: __props.config.disabled
                }, null, 8, ["data", "disabled"])
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LineageView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LineageView = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-8c1378ea"]]), { __name: "LineageView" });

export { LineageView as L, useBreedSelector as u };
//# sourceMappingURL=LineageView-C3k_ydFt.mjs.map
