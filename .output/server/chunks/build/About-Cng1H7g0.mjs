import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "text",
    class: "constrain-width content"
  }, _attrs))} data-v-239634b7><div class="content-limit" data-v-239634b7><h1 data-v-239634b7>About</h1><section data-v-239634b7><h2 data-v-239634b7>Credits</h2><p data-v-239634b7>Art © Dragon Cave artists.</p><p data-v-239634b7> Assets (backgrounds, portions of CSS and HTML) © Dragon Cave. </p><p data-v-239634b7> Code and design © <a href="https://chazza.me" data-v-239634b7>eden chazard</a>. </p><div class="special-thanks" data-v-239634b7><p data-v-239634b7> Special thanks to <i data-v-239634b7>Mu-Cephei (endulum)</i> for their crazy work with the themes. </p><aside data-v-239634b7><p data-v-239634b7> Check out their <a href="https://endulum.github.io/dc-shuffle-clock/index.html" data-v-239634b7>Cave Shuffle Clock here</a>! </p></aside></div></section><section data-v-239634b7><h2 data-v-239634b7>Art Usage</h2><p data-v-239634b7> As sprites require permission from their makers to host off-site, most dragons are rendered with style positioning and hotlinking to dragon images hosted on DC as a fallback. However, for sprites where permission has been granted to host off-site, Lineage Builder will use locally stored copies. These images are exactly as they appear on DC, whereas fallback images may appear slightly blurry. </p><section data-v-239634b7><h3 data-v-239634b7>Breed removal</h3><p data-v-239634b7> Breeds can be removed at any time at the request of the spriter, just contact me on the forum. </p></section></section><section data-v-239634b7><h2 data-v-239634b7>Terms of Use</h2><p data-v-239634b7> Have fun! Lineage Builder is a fan-made project unaffiliated with DragCave.net. </p><p data-v-239634b7> Its intended use is for building DragCave lineages, anything else may constitute misuse. </p><p data-v-239634b7> There are no guarantees made about this project and no responsibility will be accepted for anything that may happen as a result of you using it. </p></section><section data-v-239634b7><h2 data-v-239634b7>Privacy Policy</h2><p data-v-239634b7> Lineage Builder itself does not store any data on the server aside from the lineages you submit, the number of times viewed and the last viewed date. </p><p data-v-239634b7> Some data, such as cloned items and caches, is stored locally on your device and essential for some features to work. However, no cookies are used. </p><p data-v-239634b7> Some data is collected separately by the webhost for logging and analytical purposes and cannot be disabled. This data is: </p><ul class="list" data-v-239634b7><li data-v-239634b7>IP address</li><li data-v-239634b7>Url address</li><li data-v-239634b7>User Agent string</li><li data-v-239634b7>Referrer</li><li data-v-239634b7>Access time</li></ul></section><section data-v-239634b7><h2 data-v-239634b7>Contact</h2><p data-v-239634b7> Any concerns or messages can be directed at my <a href="https://forums.dragcave.net/profile/12154-fortytwo/" target="_blank" data-v-239634b7>forum profile.</a></p></section></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/About.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const About = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-239634b7"]]);

export { About as default };
//# sourceMappingURL=About-Cng1H7g0.mjs.map
