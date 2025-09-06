import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, ref, useTemplateRef, mergeProps, unref, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, G as settings, H as BREEDNAMEREGEXP, p as placeholder } from './server.mjs';
import { D as DragonPortrait } from './DragonPortrait-CBnMtC3n.mjs';
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
import 'vue-router';
import '@fortawesome/vue-fontawesome';
import 'yup';
import 'unique-names-generator';
import '@vueuse/integrations/useFocusTrap';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GhostBreedUpload",
  __ssrInlineRender: true,
  props: {
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["tileChosen", "uploadError"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    __expose({ focus });
    const fileInput = ref();
    const tile = ref();
    const dragon = reactive({
      // copy placeholder properties and replace what we need
      ...placeholder,
      image: new URL("../assets/images/placeholder.png", globalThis._importMeta_.url).href,
      metaData: {
        src: "ghost",
        group: "Standard",
        tags: ["Regular"]
      }
    });
    function openDialog() {
      if (props.disabled) return;
      if (fileInput.value === void 0) return;
      fileInput.value.click();
    }
    function focus() {
      if (props.disabled) return;
      tile.value?.$el.focus();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(DragonPortrait, mergeProps({
        ref_key: "tile",
        ref: tile,
        class: "pointer"
      }, _ctx.$attrs, {
        data: dragon,
        role: "button",
        tabindex: __props.disabled ? -1 : 0,
        "aria-disabled": __props.disabled,
        onClick: openDialog,
        onKeyup: openDialog
      }), null, _parent));
      _push(`<input${ssrRenderAttr("id", __props.label)} class="file" type="file" accept="image/png, image/gif" tabindex="-1" data-v-c73fedde><!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GhostBreedUpload.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const GhostBreedUpload = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-c73fedde"]]), { __name: "GhostBreedUpload" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GhostBreeds",
  __ssrInlineRender: true,
  setup(__props) {
    const name = ref("Ghost Breed");
    const genderAvailability = ref("b");
    const femaleBase64 = ref("");
    const maleBase64 = ref("");
    const femaleTile = useTemplateRef("femaleTile");
    const maleTile = useTemplateRef("maleTile");
    const status = useTemplateRef("status");
    function portraitSelected(gender, base64) {
      if (gender === "m") maleBase64.value = base64;
      else if (gender === "f") femaleBase64.value = base64;
    }
    function uploadError(error) {
      if (!status.value) return;
      status.value.error(`Upload error: ${error}.`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "constrain-width content" }, _attrs))} data-v-fd165435><section class="content-limit" data-v-fd165435><h1 data-v-fd165435>Ghost Breeds</h1><p data-v-fd165435> On this page you can upload custom breeds, aka &quot;ghost breeds&quot;, to Lineage Builder. This can be useful if you have breed you&#39;ve created and want to see what it looks like in lineages. All you have to do is upload the lineage tile and fill in the settings. </p><p data-v-fd165435> Ghost breeds will be added under the &quot;Standard&quot; and &quot;Regular&quot; tags and will only be active for the <strong data-v-fd165435>duration of the session</strong>. As soon as you exit the page they will be automatically deleted! The whole process takes place client-side, they are <strong data-v-fd165435>not uploaded</strong> to the server which means it doesn&#39;t break DC&#39;s artist agreement for sharing unreleased breeds. </p><p data-v-fd165435> Ensure that names are unique and tiles are less than ${ssrInterpolate(unref(settings).ghostBreedSize / 1e3)}KB. DC lineage tiles are 48Hx36W on lower resolutions and 96Hx72W on higher resolutions. </p></section><form id="form" class="form" data-v-fd165435><label class="label" for="name" data-v-fd165435>Breed name</label><input id="name"${ssrRenderAttr("value", name.value)} type="text" name="name" class="interactive" required title="Breed name must be alphanumeric and 1-32 characters long."${ssrRenderAttr("pattern", unref(BREEDNAMEREGEXP).toString().slice(1, -1))} data-v-fd165435><span class="label" data-v-fd165435>Gender availability</span><div id="gender-availability" data-v-fd165435><input id="avail_both"${ssrIncludeBooleanAttr(ssrLooseEqual(genderAvailability.value, "b")) ? " checked" : ""} type="radio" value="b" data-v-fd165435><label for="avail_both" data-v-fd165435>Both</label><input id="avail_male"${ssrIncludeBooleanAttr(ssrLooseEqual(genderAvailability.value, "m")) ? " checked" : ""} type="radio" value="m" data-v-fd165435><label for="avail_male" data-v-fd165435>Male-only</label><input id="avail_female"${ssrIncludeBooleanAttr(ssrLooseEqual(genderAvailability.value, "f")) ? " checked" : ""} type="radio" value="f" data-v-fd165435><label for="avail_female" data-v-fd165435>Female-only</label></div><span class="label" data-v-fd165435>Tiles</span><div id="tiles" data-v-fd165435>`);
      if (["b", "m"].includes(genderAvailability.value)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(GhostBreedUpload, {
          ref_key: "maleTile",
          ref: maleTile,
          label: "male",
          "aria-required": "true",
          class: ["select", { invalid: maleBase64.value === "" }],
          onTileChosen: (base64) => portraitSelected("m", base64),
          onUploadError: uploadError
        }, null, _parent));
        _push(`<label class="tile-label" for="male" data-v-fd165435>Male </label><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (["b", "f"].includes(genderAvailability.value)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(GhostBreedUpload, {
          ref_key: "femaleTile",
          ref: femaleTile,
          class: ["select", { invalid: femaleBase64.value === "" }],
          label: "female",
          "aria-required": "true",
          onTileChosen: (base64) => portraitSelected("f", base64),
          onUploadError: uploadError
        }, null, _parent));
        _push(`<label class="tile-label" for="female" data-v-fd165435>Female</label><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit" class="btn pointer" data-v-fd165435> Add breed </button></form>`);
      _push(ssrRenderComponent(FeedbackPanel, {
        ref_key: "status",
        ref: status
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/GhostBreeds.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const GhostBreeds = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fd165435"]]);

export { GhostBreeds as default };
//# sourceMappingURL=GhostBreeds-CJac7W6-.mjs.map
