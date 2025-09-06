import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, shallowRef, computed, toValue, reactive, ref, watch, useTemplateRef, nextTick, mergeProps, unref, hasInjectionContext, getCurrentInstance, watchEffect, getCurrentScope, onScopeDispose, toRef as toRef$1, readonly, customRef, isRef, markRaw, createElementBlock, provide, cloneVNode, h, inject, Suspense, Fragment, useSSRContext, createApp, shallowReactive, resolveComponent, withCtx, createVNode, toDisplayString, createTextVNode, mergeModels, useModel, useId, withDirectives, vModelText, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, effectScope, isReadonly, isShallow, isReactive, toRaw, defineAsyncComponent } from 'vue';
import { l as hasProtocol, p as isScriptProtocol, m as joinURL, w as withQuery, q as sanitizeStatusCode, t as getContext, $ as $fetch$1, v as createHooks, x as executeAsync, c as createError$1, y as toRouteMatcher, z as createRouter$1, A as defu } from '../nitro/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { defineStore, createPinia, setActivePinia, shouldHydrate } from 'pinia';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { object, string, lazy, number } from 'yup';
import { uniqueNamesGenerator, names, colors, animals } from 'unique-names-generator';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.1.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef$1(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
const _routes = [
  {
    name: "About",
    path: "/About",
    component: () => import('./About-Cng1H7g0.mjs')
  },
  {
    name: "Builder",
    path: "/Builder",
    component: () => import('./Builder-CBCxWP4O.mjs')
  },
  {
    name: "Tutorial",
    path: "/Tutorial",
    component: () => import('./Tutorial-mnLpp8hj.mjs')
  },
  {
    name: "errors-404",
    path: "/errors/404",
    component: () => import('./404-BK2MFAT2.mjs')
  },
  {
    name: "GhostBreeds",
    path: "/GhostBreeds",
    component: () => import('./GhostBreeds-CJac7W6-.mjs')
  },
  {
    name: "LineageView",
    path: "/LineageView",
    component: () => import('./LineageView-DFVRTkRI.mjs')
  },
  {
    name: "InbredChecker",
    path: "/InbredChecker",
    component: () => import('./InbredChecker-BXnE4Y2Z.mjs')
  },
  {
    name: "OnsitePreview",
    path: "/OnsitePreview",
    component: () => import('./OnsitePreview-G3EvGa9h.mjs')
  },
  {
    name: "CheckerGenerator",
    path: "/CheckerGenerator",
    component: () => import('./CheckerGenerator-BxECh1M3.mjs')
  }
];
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      if (to.matched[to.matched.length - 1]?.components?.default === from.matched[from.matched.length - 1]?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    useError();
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray$1(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8
];
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
const localProvidedStateMap = /* @__PURE__ */ new WeakMap();
const injectLocal = (...args) => {
  var _a;
  const key = args[0];
  const instance = (_a = getCurrentInstance()) == null ? void 0 : _a.proxy;
  if (instance == null && !hasInjectionContext())
    throw new Error("injectLocal must be called in setup");
  if (instance && localProvidedStateMap.has(instance) && key in localProvidedStateMap.get(instance))
    return localProvidedStateMap.get(instance)[key];
  return inject(...args);
};
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const timestamp = () => +Date.now();
const noop = () => {
};
function toRef(...args) {
  if (args.length !== 1)
    return toRef$1(...args);
  const r = args[0];
  return typeof r === "function" ? readonly(customRef(() => ({ get: r, set: noop }))) : ref(r);
}
function createFilterWrapper(filter, fn) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
    });
  }
  return wrapper;
}
const bypassFilter = (invoke2) => {
  return invoke2();
};
function debounceFilter(ms, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop;
  const _clearTimeout = (timer2) => {
    clearTimeout(timer2);
    lastRejector();
    lastRejector = noop;
  };
  let lastInvoker;
  const filter = (invoke2) => {
    const duration = toValue(ms);
    const maxDuration = toValue(options.maxWait);
    if (timer)
      _clearTimeout(timer);
    if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = null;
      }
      return Promise.resolve(invoke2());
    }
    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve;
      lastInvoker = invoke2;
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer)
            _clearTimeout(timer);
          maxTimer = null;
          resolve(lastInvoker());
        }, maxDuration);
      }
      timer = setTimeout(() => {
        if (maxTimer)
          _clearTimeout(maxTimer);
        maxTimer = null;
        resolve(invoke2());
      }, duration);
    });
  };
  return filter;
}
function throttleFilter(...args) {
  let lastExec = 0;
  let timer;
  let isLeading = true;
  let lastRejector = noop;
  let lastValue;
  let ms;
  let trailing;
  let leading;
  let rejectOnCancel;
  if (!isRef(args[0]) && typeof args[0] === "object")
    ({ delay: ms, trailing = true, leading = true, rejectOnCancel = false } = args[0]);
  else
    [ms, trailing = true, leading = true, rejectOnCancel = false] = args;
  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
      lastRejector();
      lastRejector = noop;
    }
  };
  const filter = (_invoke) => {
    const duration = toValue(ms);
    const elapsed = Date.now() - lastExec;
    const invoke2 = () => {
      return lastValue = _invoke();
    };
    clear();
    if (duration <= 0) {
      lastExec = Date.now();
      return invoke2();
    }
    if (elapsed > duration && (leading || !isLeading)) {
      lastExec = Date.now();
      invoke2();
    } else if (trailing) {
      lastValue = new Promise((resolve, reject) => {
        lastRejector = rejectOnCancel ? reject : resolve;
        timer = setTimeout(() => {
          lastExec = Date.now();
          isLeading = true;
          resolve(invoke2());
          clear();
        }, Math.max(0, duration - elapsed));
      });
    }
    if (!leading && !timer)
      timer = setTimeout(() => isLeading = true, duration);
    isLeading = false;
    return lastValue;
  };
  return filter;
}
function pausableFilter(extendFilter = bypassFilter, options = {}) {
  const {
    initialState = "active"
  } = options;
  const isActive = toRef(initialState === "active");
  function pause() {
    isActive.value = false;
  }
  function resume() {
    isActive.value = true;
  }
  const eventFilter = (...args) => {
    if (isActive.value)
      extendFilter(...args);
  };
  return { isActive: readonly(isActive), pause, resume, eventFilter };
}
function pxValue(px) {
  return px.endsWith("rem") ? Number.parseFloat(px) * 16 : Number.parseFloat(px);
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function getLifeCycleTarget(target) {
  return getCurrentInstance();
}
function useDebounceFn(fn, ms = 200, options = {}) {
  return createFilterWrapper(
    debounceFilter(ms, options),
    fn
  );
}
function useThrottleFn(fn, ms = 200, trailing = false, leading = true, rejectOnCancel = false) {
  return createFilterWrapper(
    throttleFilter(ms, trailing, leading, rejectOnCancel),
    fn
  );
}
function watchWithFilter(source, cb, options = {}) {
  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options;
  return watch(
    source,
    createFilterWrapper(
      eventFilter,
      cb
    ),
    watchOptions
  );
}
function watchPausable(source, cb, options = {}) {
  const {
    eventFilter: filter,
    initialState = "active",
    ...watchOptions
  } = options;
  const { eventFilter, pause, resume, isActive } = pausableFilter(filter, { initialState });
  const stop = watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter
    }
  );
  return { stop, pause, resume, isActive };
}
function tryOnMounted(fn, sync = true, target) {
  const instance = getLifeCycleTarget();
  if (instance)
    ;
  else if (sync)
    fn();
  else
    nextTick(fn);
}
function watchIgnorable(source, cb, options = {}) {
  const {
    eventFilter = bypassFilter,
    ...watchOptions
  } = options;
  const filteredCb = createFilterWrapper(
    eventFilter,
    cb
  );
  let ignoreUpdates;
  let ignorePrevAsyncUpdates;
  let stop;
  if (watchOptions.flush === "sync") {
    const ignore = shallowRef(false);
    ignorePrevAsyncUpdates = () => {
    };
    ignoreUpdates = (updater) => {
      ignore.value = true;
      updater();
      ignore.value = false;
    };
    stop = watch(
      source,
      (...args) => {
        if (!ignore.value)
          filteredCb(...args);
      },
      watchOptions
    );
  } else {
    const disposables = [];
    const ignoreCounter = shallowRef(0);
    const syncCounter = shallowRef(0);
    ignorePrevAsyncUpdates = () => {
      ignoreCounter.value = syncCounter.value;
    };
    disposables.push(
      watch(
        source,
        () => {
          syncCounter.value++;
        },
        { ...watchOptions, flush: "sync" }
      )
    );
    ignoreUpdates = (updater) => {
      const syncCounterPrev = syncCounter.value;
      updater();
      ignoreCounter.value += syncCounter.value - syncCounterPrev;
    };
    disposables.push(
      watch(
        source,
        (...args) => {
          const ignore = ignoreCounter.value > 0 && ignoreCounter.value === syncCounter.value;
          ignoreCounter.value = 0;
          syncCounter.value = 0;
          if (ignore)
            return;
          filteredCb(...args);
        },
        watchOptions
      )
    );
    stop = () => {
      disposables.forEach((fn) => fn());
    };
  }
  return { stop, ignoreUpdates, ignorePrevAsyncUpdates };
}
function watchImmediate(source, cb, options) {
  return watch(
    source,
    cb,
    {
      ...options,
      immediate: true
    }
  );
}
const defaultWindow = void 0;
const defaultDocument = void 0;
const defaultNavigator = void 0;
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
function useEventListener(...args) {
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };
  const firstParamTargets = computed(() => {
    const test = toArray(toValue(args[0])).filter((e) => e != null);
    return test.every((e) => typeof e !== "string") ? test : void 0;
  });
  const stopWatch = watchImmediate(
    () => {
      var _a, _b;
      return [
        (_b = (_a = firstParamTargets.value) == null ? void 0 : _a.map((e) => unrefElement(e))) != null ? _b : [defaultWindow].filter((e) => e != null),
        toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
        toArray(unref(firstParamTargets.value ? args[2] : args[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        toValue(firstParamTargets.value ? args[3] : args[2])
      ];
    },
    ([raw_targets, raw_events, raw_listeners, raw_options]) => {
      cleanup();
      if (!(raw_targets == null ? void 0 : raw_targets.length) || !(raw_events == null ? void 0 : raw_events.length) || !(raw_listeners == null ? void 0 : raw_listeners.length))
        return;
      const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
      cleanups.push(
        ...raw_targets.flatMap(
          (el) => raw_events.flatMap(
            (event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))
          )
        )
      );
    },
    { flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(cleanup);
  return stop;
}
function useMounted() {
  const isMounted = shallowRef(false);
  getCurrentInstance();
  return isMounted;
}
function useSupported(callback) {
  const isMounted = useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function createKeyPredicate(keyFilter) {
  if (typeof keyFilter === "function")
    return keyFilter;
  else if (typeof keyFilter === "string")
    return (event) => event.key === keyFilter;
  else if (Array.isArray(keyFilter))
    return (event) => keyFilter.includes(event.key);
  return () => true;
}
function onKeyStroke(...args) {
  let key;
  let handler;
  let options = {};
  if (args.length === 3) {
    key = args[0];
    handler = args[1];
    options = args[2];
  } else if (args.length === 2) {
    if (typeof args[1] === "object") {
      key = true;
      handler = args[0];
      options = args[1];
    } else {
      key = args[0];
      handler = args[1];
    }
  } else {
    key = true;
    handler = args[0];
  }
  const {
    target = defaultWindow,
    eventName = "keydown",
    passive = false,
    dedupe = false
  } = options;
  const predicate = createKeyPredicate(key);
  const listener = (e) => {
    if (e.repeat && toValue(dedupe))
      return;
    if (predicate(e))
      handler(e);
  };
  return useEventListener(target, eventName, listener, passive);
}
function onKeyDown(key, handler, options = {}) {
  return onKeyStroke(key, handler, { ...options, eventName: "keydown" });
}
function isFocusedElementEditable() {
  const { activeElement, body } = void 0;
  if (!activeElement)
    return false;
  if (activeElement === body)
    return false;
  switch (activeElement.tagName) {
    case "INPUT":
    case "TEXTAREA":
      return true;
  }
  return activeElement.hasAttribute("contenteditable");
}
function isTypedCharValid({
  keyCode,
  metaKey,
  ctrlKey,
  altKey
}) {
  if (metaKey || ctrlKey || altKey)
    return false;
  if (keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 105)
    return true;
  if (keyCode >= 65 && keyCode <= 90)
    return true;
  return false;
}
function onStartTyping(callback, options = {}) {
  const { document: document2 = defaultDocument } = options;
  const keydown = (event) => {
    if (!isFocusedElementEditable() && isTypedCharValid(event)) {
      callback(event);
    }
  };
  if (document2)
    useEventListener(document2, "keydown", keydown, { passive: true });
}
const ssrWidthSymbol = Symbol("vueuse-ssr-width");
function useSSRWidth() {
  const ssrWidth = hasInjectionContext() ? injectLocal(ssrWidthSymbol, null) : null;
  return typeof ssrWidth === "number" ? ssrWidth : void 0;
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow, ssrWidth = useSSRWidth() } = options;
  const isSupported = useSupported(() => window2 && "matchMedia" in window2 && typeof window2.matchMedia === "function");
  const ssrSupport = shallowRef(typeof ssrWidth === "number");
  const mediaQuery = shallowRef();
  const matches = shallowRef(false);
  const handler = (event) => {
    matches.value = event.matches;
  };
  watchEffect(() => {
    if (ssrSupport.value) {
      ssrSupport.value = !isSupported.value;
      const queryStrings = toValue(query).split(",");
      matches.value = queryStrings.some((queryString) => {
        const not = queryString.includes("not all");
        const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        let res = Boolean(minWidth || maxWidth);
        if (minWidth && res) {
          res = ssrWidth >= pxValue(minWidth[1]);
        }
        if (maxWidth && res) {
          res = ssrWidth <= pxValue(maxWidth[1]);
        }
        return not ? !res : res;
      });
      return;
    }
    if (!isSupported.value)
      return;
    mediaQuery.value = window2.matchMedia(toValue(query));
    matches.value = mediaQuery.value.matches;
  });
  useEventListener(mediaQuery, "change", handler, { passive: true });
  return computed(() => matches.value);
}
function cloneFnJSON(source) {
  return JSON.parse(JSON.stringify(source));
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
const handlers = /* @__PURE__ */ getHandlers();
function getHandlers() {
  if (!(globalKey in _global))
    _global[globalKey] = _global[globalKey] || {};
  return _global[globalKey];
}
function getSSRHandler(key, fallback) {
  return handlers[key] || fallback;
}
function guessSerializerType(rawInit) {
  return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
const StorageSerializers = {
  boolean: {
    read: (v) => v === "true",
    write: (v) => String(v)
  },
  object: {
    read: (v) => JSON.parse(v),
    write: (v) => JSON.stringify(v)
  },
  number: {
    read: (v) => Number.parseFloat(v),
    write: (v) => String(v)
  },
  any: {
    read: (v) => v,
    write: (v) => String(v)
  },
  string: {
    read: (v) => v,
    write: (v) => String(v)
  },
  map: {
    read: (v) => new Map(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v.entries()))
  },
  set: {
    read: (v) => new Set(JSON.parse(v)),
    write: (v) => JSON.stringify(Array.from(v))
  },
  date: {
    read: (v) => new Date(v),
    write: (v) => v.toISOString()
  }
};
const customStorageEventName = "vueuse-storage";
function useStorage(key, defaults2, storage, options = {}) {
  var _a;
  const {
    flush = "pre",
    deep = true,
    listenToStorageChanges = true,
    writeDefaults = true,
    mergeDefaults = false,
    shallow,
    window: window2 = defaultWindow,
    eventFilter,
    onError = (e) => {
      console.error(e);
    },
    initOnMounted
  } = options;
  const data = (shallow ? shallowRef : ref)(typeof defaults2 === "function" ? defaults2() : defaults2);
  const keyComputed = computed(() => toValue(key));
  if (!storage) {
    try {
      storage = getSSRHandler("getDefaultStorage", () => {
        var _a2;
        return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
      })();
    } catch (e) {
      onError(e);
    }
  }
  if (!storage)
    return data;
  const rawInit = toValue(defaults2);
  const type = guessSerializerType(rawInit);
  const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
  const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
    data,
    () => write(data.value),
    { flush, deep, eventFilter }
  );
  watch(keyComputed, () => update(), { flush });
  if (window2 && listenToStorageChanges) {
    tryOnMounted(() => {
      if (storage instanceof Storage)
        useEventListener(window2, "storage", update, { passive: true });
      else
        useEventListener(window2, customStorageEventName, updateFromCustomEvent);
      if (initOnMounted)
        update();
    });
  }
  if (!initOnMounted)
    update();
  function dispatchWriteEvent(oldValue, newValue) {
    if (window2) {
      const payload = {
        key: keyComputed.value,
        oldValue,
        newValue,
        storageArea: storage
      };
      window2.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, {
        detail: payload
      }));
    }
  }
  function write(v) {
    try {
      const oldValue = storage.getItem(keyComputed.value);
      if (v == null) {
        dispatchWriteEvent(oldValue, null);
        storage.removeItem(keyComputed.value);
      } else {
        const serialized = serializer.write(v);
        if (oldValue !== serialized) {
          storage.setItem(keyComputed.value, serialized);
          dispatchWriteEvent(oldValue, serialized);
        }
      }
    } catch (e) {
      onError(e);
    }
  }
  function read(event) {
    const rawValue = event ? event.newValue : storage.getItem(keyComputed.value);
    if (rawValue == null) {
      if (writeDefaults && rawInit != null)
        storage.setItem(keyComputed.value, serializer.write(rawInit));
      return rawInit;
    } else if (!event && mergeDefaults) {
      const value = serializer.read(rawValue);
      if (typeof mergeDefaults === "function")
        return mergeDefaults(value, rawInit);
      else if (type === "object" && !Array.isArray(value))
        return { ...rawInit, ...value };
      return value;
    } else if (typeof rawValue !== "string") {
      return rawValue;
    } else {
      return serializer.read(rawValue);
    }
  }
  function update(event) {
    if (event && event.storageArea !== storage)
      return;
    if (event && event.key == null) {
      data.value = rawInit;
      return;
    }
    if (event && event.key !== keyComputed.value)
      return;
    pauseWatch();
    try {
      if ((event == null ? void 0 : event.newValue) !== serializer.write(data.value))
        data.value = read(event);
    } catch (e) {
      onError(e);
    } finally {
      if (event)
        nextTick(resumeWatch);
      else
        resumeWatch();
    }
  }
  function updateFromCustomEvent(event) {
    update(event.detail);
  }
  return data;
}
function fnBypass(v) {
  return v;
}
function fnSetSource(source, value) {
  return source.value = value;
}
function defaultDump(clone) {
  return clone ? typeof clone === "function" ? clone : cloneFnJSON : fnBypass;
}
function defaultParse(clone) {
  return clone ? typeof clone === "function" ? clone : cloneFnJSON : fnBypass;
}
function useManualRefHistory(source, options = {}) {
  const {
    clone = false,
    dump = defaultDump(clone),
    parse = defaultParse(clone),
    setSource = fnSetSource
  } = options;
  function _createHistoryRecord() {
    return markRaw({
      snapshot: dump(source.value),
      timestamp: timestamp()
    });
  }
  const last = ref(_createHistoryRecord());
  const undoStack = ref([]);
  const redoStack = ref([]);
  const _setSource = (record) => {
    setSource(source, parse(record.snapshot));
    last.value = record;
  };
  const commit = () => {
    undoStack.value.unshift(last.value);
    last.value = _createHistoryRecord();
    if (options.capacity && undoStack.value.length > options.capacity)
      undoStack.value.splice(options.capacity, Number.POSITIVE_INFINITY);
    if (redoStack.value.length)
      redoStack.value.splice(0, redoStack.value.length);
  };
  const clear = () => {
    undoStack.value.splice(0, undoStack.value.length);
    redoStack.value.splice(0, redoStack.value.length);
  };
  const undo = () => {
    const state = undoStack.value.shift();
    if (state) {
      redoStack.value.unshift(last.value);
      _setSource(state);
    }
  };
  const redo = () => {
    const state = redoStack.value.shift();
    if (state) {
      undoStack.value.unshift(last.value);
      _setSource(state);
    }
  };
  const reset = () => {
    _setSource(last.value);
  };
  const history = computed(() => [last.value, ...undoStack.value]);
  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);
  return {
    source,
    undoStack,
    redoStack,
    last,
    history,
    canUndo,
    canRedo,
    clear,
    commit,
    reset,
    undo,
    redo
  };
}
function useRefHistory(source, options = {}) {
  const {
    deep = false,
    flush = "pre",
    eventFilter
  } = options;
  const {
    eventFilter: composedFilter,
    pause,
    resume: resumeTracking,
    isActive: isTracking
  } = pausableFilter(eventFilter);
  const {
    ignoreUpdates,
    ignorePrevAsyncUpdates,
    stop
  } = watchIgnorable(
    source,
    commit,
    { deep, flush, eventFilter: composedFilter }
  );
  function setSource(source2, value) {
    ignorePrevAsyncUpdates();
    ignoreUpdates(() => {
      source2.value = value;
    });
  }
  const manualHistory = useManualRefHistory(source, { ...options, clone: options.clone || deep, setSource });
  const { clear, commit: manualCommit } = manualHistory;
  function commit() {
    ignorePrevAsyncUpdates();
    manualCommit();
  }
  function resume(commitNow) {
    resumeTracking();
    if (commitNow)
      commit();
  }
  function batch(fn) {
    let canceled = false;
    const cancel = () => canceled = true;
    ignoreUpdates(() => {
      fn(cancel);
    });
    if (!canceled)
      commit();
  }
  function dispose() {
    stop();
    clear();
  }
  return {
    ...manualHistory,
    isTracking,
    pause,
    resume,
    commit,
    batch,
    dispose
  };
}
function useDebouncedRefHistory(source, options = {}) {
  const filter = options.debounce ? debounceFilter(options.debounce) : void 0;
  const history = useRefHistory(source, { ...options, eventFilter: filter });
  return {
    ...history
  };
}
function useDevicePixelRatio(options = {}) {
  const {
    window: window2 = defaultWindow
  } = options;
  const pixelRatio = shallowRef(1);
  const query = useMediaQuery(() => `(resolution: ${pixelRatio.value}dppx)`, options);
  let stop = noop;
  if (window2) {
    stop = watchImmediate(query, () => pixelRatio.value = window2.devicePixelRatio);
  }
  return {
    pixelRatio: readonly(pixelRatio),
    stop
  };
}
function useResizeObserver(target, callback, options = {}) {
  const { window: window2 = defaultWindow, ...observerOptions } = options;
  let observer;
  const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const targets = computed(() => {
    const _targets = toValue(target);
    return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
  });
  const stopWatch = watch(
    targets,
    (els) => {
      cleanup();
      if (isSupported.value && window2) {
        observer = new ResizeObserver(callback);
        for (const _el of els) {
          if (_el)
            observer.observe(_el, observerOptions);
        }
      }
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
const eventHandlers = [
  "fullscreenchange",
  "webkitfullscreenchange",
  "webkitendfullscreen",
  "mozfullscreenchange",
  "MSFullscreenChange"
];
function useFullscreen(target, options = {}) {
  const {
    document: document2 = defaultDocument,
    autoExit = false
  } = options;
  const targetRef = computed(() => {
    var _a;
    return (_a = unrefElement(target)) != null ? _a : document2 == null ? void 0 : document2.documentElement;
  });
  const isFullscreen = shallowRef(false);
  const requestMethod = computed(() => {
    return [
      "requestFullscreen",
      "webkitRequestFullscreen",
      "webkitEnterFullscreen",
      "webkitEnterFullScreen",
      "webkitRequestFullScreen",
      "mozRequestFullScreen",
      "msRequestFullscreen"
    ].find((m) => document2 && m in document2 || targetRef.value && m in targetRef.value);
  });
  const exitMethod = computed(() => {
    return [
      "exitFullscreen",
      "webkitExitFullscreen",
      "webkitExitFullScreen",
      "webkitCancelFullScreen",
      "mozCancelFullScreen",
      "msExitFullscreen"
    ].find((m) => document2 && m in document2 || targetRef.value && m in targetRef.value);
  });
  const fullscreenEnabled = computed(() => {
    return [
      "fullScreen",
      "webkitIsFullScreen",
      "webkitDisplayingFullscreen",
      "mozFullScreen",
      "msFullscreenElement"
    ].find((m) => document2 && m in document2 || targetRef.value && m in targetRef.value);
  });
  const fullscreenElementMethod = [
    "fullscreenElement",
    "webkitFullscreenElement",
    "mozFullScreenElement",
    "msFullscreenElement"
  ].find((m) => document2 && m in document2);
  const isSupported = useSupported(() => targetRef.value && document2 && requestMethod.value !== void 0 && exitMethod.value !== void 0 && fullscreenEnabled.value !== void 0);
  const isCurrentElementFullScreen = () => {
    if (fullscreenElementMethod)
      return (document2 == null ? void 0 : document2[fullscreenElementMethod]) === targetRef.value;
    return false;
  };
  const isElementFullScreen = () => {
    if (fullscreenEnabled.value) {
      if (document2 && document2[fullscreenEnabled.value] != null) {
        return document2[fullscreenEnabled.value];
      } else {
        const target2 = targetRef.value;
        if ((target2 == null ? void 0 : target2[fullscreenEnabled.value]) != null) {
          return Boolean(target2[fullscreenEnabled.value]);
        }
      }
    }
    return false;
  };
  async function exit() {
    if (!isSupported.value || !isFullscreen.value)
      return;
    if (exitMethod.value) {
      if ((document2 == null ? void 0 : document2[exitMethod.value]) != null) {
        await document2[exitMethod.value]();
      } else {
        const target2 = targetRef.value;
        if ((target2 == null ? void 0 : target2[exitMethod.value]) != null)
          await target2[exitMethod.value]();
      }
    }
    isFullscreen.value = false;
  }
  async function enter() {
    if (!isSupported.value || isFullscreen.value)
      return;
    if (isElementFullScreen())
      await exit();
    const target2 = targetRef.value;
    if (requestMethod.value && (target2 == null ? void 0 : target2[requestMethod.value]) != null) {
      await target2[requestMethod.value]();
      isFullscreen.value = true;
    }
  }
  async function toggle() {
    await (isFullscreen.value ? exit() : enter());
  }
  const handlerCallback = () => {
    const isElementFullScreenValue = isElementFullScreen();
    if (!isElementFullScreenValue || isElementFullScreenValue && isCurrentElementFullScreen())
      isFullscreen.value = isElementFullScreenValue;
  };
  const listenerOptions = { capture: false, passive: true };
  useEventListener(document2, eventHandlers, handlerCallback, listenerOptions);
  useEventListener(() => unrefElement(targetRef), eventHandlers, handlerCallback, listenerOptions);
  if (autoExit)
    tryOnScopeDispose(exit);
  return {
    isSupported,
    isFullscreen,
    enter,
    exit,
    toggle
  };
}
function resolveElement(el) {
  if (typeof Window !== "undefined" && el instanceof Window)
    return el.document.documentElement;
  if (typeof Document !== "undefined" && el instanceof Document)
    return el.documentElement;
  return el;
}
const ARRIVED_STATE_THRESHOLD_PIXELS = 1;
function useScroll(element, options = {}) {
  const {
    throttle = 0,
    idle = 200,
    onStop = noop,
    onScroll = noop,
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventListenerOptions = {
      capture: false,
      passive: true
    },
    behavior = "auto",
    window: window2 = defaultWindow,
    onError = (e) => {
      console.error(e);
    }
  } = options;
  const internalX = shallowRef(0);
  const internalY = shallowRef(0);
  const x = computed({
    get() {
      return internalX.value;
    },
    set(x2) {
      scrollTo(x2, void 0);
    }
  });
  const y = computed({
    get() {
      return internalY.value;
    },
    set(y2) {
      scrollTo(void 0, y2);
    }
  });
  function scrollTo(_x, _y) {
    var _a, _b, _c, _d;
    if (!window2)
      return;
    const _element = toValue(element);
    if (!_element)
      return;
    (_c = _element instanceof Document ? window2.document.body : _element) == null ? void 0 : _c.scrollTo({
      top: (_a = toValue(_y)) != null ? _a : y.value,
      left: (_b = toValue(_x)) != null ? _b : x.value,
      behavior: toValue(behavior)
    });
    const scrollContainer = ((_d = _element == null ? void 0 : _element.document) == null ? void 0 : _d.documentElement) || (_element == null ? void 0 : _element.documentElement) || _element;
    if (x != null)
      internalX.value = scrollContainer.scrollLeft;
    if (y != null)
      internalY.value = scrollContainer.scrollTop;
  }
  const isScrolling = shallowRef(false);
  const arrivedState = reactive({
    left: true,
    right: false,
    top: true,
    bottom: false
  });
  const directions = reactive({
    left: false,
    right: false,
    top: false,
    bottom: false
  });
  const onScrollEnd = (e) => {
    if (!isScrolling.value)
      return;
    isScrolling.value = false;
    directions.left = false;
    directions.right = false;
    directions.top = false;
    directions.bottom = false;
    onStop(e);
  };
  const onScrollEndDebounced = useDebounceFn(onScrollEnd, throttle + idle);
  const setArrivedState = (target) => {
    var _a;
    if (!window2)
      return;
    const el = ((_a = target == null ? void 0 : target.document) == null ? void 0 : _a.documentElement) || (target == null ? void 0 : target.documentElement) || unrefElement(target);
    const { display, flexDirection, direction } = getComputedStyle(el);
    const directionMultipler = direction === "rtl" ? -1 : 1;
    const scrollLeft = el.scrollLeft;
    directions.left = scrollLeft < internalX.value;
    directions.right = scrollLeft > internalX.value;
    const left = Math.abs(scrollLeft * directionMultipler) <= (offset.left || 0);
    const right = Math.abs(scrollLeft * directionMultipler) + el.clientWidth >= el.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === "flex" && flexDirection === "row-reverse") {
      arrivedState.left = right;
      arrivedState.right = left;
    } else {
      arrivedState.left = left;
      arrivedState.right = right;
    }
    internalX.value = scrollLeft;
    let scrollTop = el.scrollTop;
    if (target === window2.document && !scrollTop)
      scrollTop = window2.document.body.scrollTop;
    directions.top = scrollTop < internalY.value;
    directions.bottom = scrollTop > internalY.value;
    const top = Math.abs(scrollTop) <= (offset.top || 0);
    const bottom = Math.abs(scrollTop) + el.clientHeight >= el.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS;
    if (display === "flex" && flexDirection === "column-reverse") {
      arrivedState.top = bottom;
      arrivedState.bottom = top;
    } else {
      arrivedState.top = top;
      arrivedState.bottom = bottom;
    }
    internalY.value = scrollTop;
  };
  const onScrollHandler = (e) => {
    var _a;
    if (!window2)
      return;
    const eventTarget = (_a = e.target.documentElement) != null ? _a : e.target;
    setArrivedState(eventTarget);
    isScrolling.value = true;
    onScrollEndDebounced(e);
    onScroll(e);
  };
  useEventListener(
    element,
    "scroll",
    throttle ? useThrottleFn(onScrollHandler, throttle, true, false) : onScrollHandler,
    eventListenerOptions
  );
  tryOnMounted(() => {
    try {
      const _element = toValue(element);
      if (!_element)
        return;
      setArrivedState(_element);
    } catch (e) {
      onError(e);
    }
  });
  useEventListener(
    element,
    "scrollend",
    onScrollEnd,
    eventListenerOptions
  );
  return {
    x,
    y,
    isScrolling,
    arrivedState,
    directions,
    measure() {
      const _element = toValue(element);
      if (window2 && _element)
        setArrivedState(_element);
    }
  };
}
function useLocalStorage(key, initialValue, options = {}) {
  const { window: window2 = defaultWindow } = options;
  return useStorage(key, initialValue, window2 == null ? void 0 : window2.localStorage, options);
}
const elInitialOverflow = /* @__PURE__ */ new WeakMap();
function useScrollLock(element, initialState = false) {
  const isLocked = shallowRef(initialState);
  let initialOverflow = "";
  watch(toRef(element), (el) => {
    const target = resolveElement(toValue(el));
    if (target) {
      const ele = target;
      if (!elInitialOverflow.get(ele))
        elInitialOverflow.set(ele, ele.style.overflow);
      if (ele.style.overflow !== "hidden")
        initialOverflow = ele.style.overflow;
      if (ele.style.overflow === "hidden")
        return isLocked.value = true;
      if (isLocked.value)
        return ele.style.overflow = "hidden";
    }
  }, {
    immediate: true
  });
  const lock = () => {
    const el = resolveElement(toValue(element));
    if (!el || isLocked.value)
      return;
    el.style.overflow = "hidden";
    isLocked.value = true;
  };
  const unlock = () => {
    const el = resolveElement(toValue(element));
    if (!el || !isLocked.value)
      return;
    el.style.overflow = initialOverflow;
    elInitialOverflow.delete(el);
    isLocked.value = false;
  };
  tryOnScopeDispose(unlock);
  return computed({
    get() {
      return isLocked.value;
    },
    set(v) {
      if (v)
        lock();
      else unlock();
    }
  });
}
function useSessionStorage(key, initialValue, options = {}) {
  const { window: window2 = defaultWindow } = options;
  return useStorage(key, initialValue, window2 == null ? void 0 : window2.sessionStorage, options);
}
function useShare(shareOptions = {}, options = {}) {
  const { navigator: navigator2 = defaultNavigator } = options;
  const _navigator = navigator2;
  const isSupported = useSupported(() => _navigator && "canShare" in _navigator);
  const share = async (overrideOptions = {}) => {
    if (isSupported.value) {
      const data = {
        ...toValue(shareOptions),
        ...toValue(overrideOptions)
      };
      let granted = true;
      if (data.files && _navigator.canShare)
        granted = _navigator.canShare({ files: data.files });
      if (granted)
        return _navigator.share(data);
    }
  };
  return {
    isSupported,
    share
  };
}
function useTreeHistory(activeTree, capacity = 5) {
  const history = useDebouncedRefHistory(activeTree, {
    deep: true,
    capacity
  });
  function undo() {
    if (history.history.value.length > 2) {
      history.undo();
    }
  }
  const canUndo = computed(() => history.history.value.length > 2);
  return {
    ...history,
    // overwrite the original undo method and can undo with ours
    undo,
    canUndo
  };
}
function createTileSize(w, h2) {
  return {
    width: w,
    height: h2,
    widthPX: `${w}px`,
    heightPX: `${h2}px`
  };
}
const settings = {
  ghostBreedSize: 2e4,
  tileSizes: {
    fullSize: createTileSize(36, 48),
    twoThirds: createTileSize(24, 32)
  },
  // inclusive
  gens: {
    min: 2,
    max: 12
  }
};
class DragonBuilder {
  static createWithMetadata(attributes = {}) {
    return {
      ...this.create(),
      selected: false,
      ...attributes
    };
  }
  static create(attributes = {}) {
    return {
      code: this.generateCode(),
      name: this.generateName(),
      parents: {},
      breed: placeholder.name,
      gender: "m",
      display: 1,
      ...attributes
    };
  }
  static generateCode() {
    const characters = "1234567890ABCDEFGHIJKLMNOPQRTUVWXYZabcdefghijklmnopqrstuvwyz";
    let str = "";
    for (let i = 0; i < 5; ++i) {
      str += characters[~~(Math.random() * characters.length)];
    }
    return str;
  }
  static generateName() {
    return uniqueNamesGenerator({
      dictionaries: [names, colors, animals],
      length: 2,
      separator: " ",
      style: "capital"
    });
  }
}
const NAMEREGEXP = /^[a-zA-Z0-9]([a-zA-Z0-9― —’–'-]+)[a-zA-Z0-9]$/;
const BREEDNAMEREGEXP = /[a-zA-Z0-9 ]{1,32}/;
const codeValidator = string().default("").test(
  "code",
  ({ value }) => `Codes must be 4 to 5 characters and alphanumeric.
  ${value} was given.`,
  validateCode
);
const nameValidator = string().default("").test(
  "name",
  ({ value }) => `Names must be 1 to 32 characters in length and only contain
    alphanumeric characters, spaces apostrophes and dashes.
    Additionally non-alphanumeric characters must not be
    present at the start and end of name. ${value} was given.`,
  validateName
);
const dragonSchema = object().shape({
  name: nameValidator.required().default(() => DragonBuilder.generateName()),
  code: codeValidator.required().default(() => DragonBuilder.generateCode()),
  display: number().required().oneOf([0, 1]).default(0),
  breed: lazy(
    () => string().required().matches(
      BREEDNAMEREGEXP,
      ({ value }) => `Breed names must be 1 to 32 characters in length and only contain
          alphanumeric characters or spaces. ${value} was given.`
    ).oneOf(
      getTrueBreeds(),
      ({ value }) => `Breed names must be official. ${value} was given.`
    ).default(placeholder.name)
  ),
  gender: string().required().oneOf(["m", "f"]),
  parents: object().required().default({}).shape({
    m: lazy(() => dragonSchema.default(void 0)),
    f: lazy(() => dragonSchema.default(void 0))
  }).shape({})
}).noUnknown();
function validateName(name) {
  return NAMEREGEXP.test(name) && name.length >= 1 && name.length <= 32;
}
function validateCode(code) {
  return NAMEREGEXP.test(code) && code.length >= 4 && code.length <= 5;
}
function validateGenerationCount(count) {
  return count >= settings.gens.min && count <= settings.gens.max;
}
function getTrueBreeds() {
  return listOfBreeds.filter((breed) => breed.metaData.src !== "ghost").map((breed) => breed.name);
}
function getBreedData(breedName) {
  const entry2 = listOfBreeds.find((v) => v.name === breedName);
  return entry2;
}
function breedEntryToPortrait(breed, gender) {
  if (gender in breed === false)
    throw new Error(`DragonGender isn't available for ${breed.name}`);
  const data = {
    name: breed.name,
    image: breed[gender],
    metaData: breed.metaData
  };
  return data;
}
function expandGender(gender) {
  return gender === "m" ? "male" : "female";
}
function getTable(gender) {
  return gender === "m" ? malePortraits : femalePortraits;
}
function hasParents(dragon) {
  return typeof dragon.parents.f === "object" && typeof dragon.parents.m === "object";
}
function createLineageLink(hash) {
  const origin = (void 0).location.origin;
  const mountPath = "/";
  return `${origin}${mountPath}/view/${hash}`;
}
const tagRegExp = /^(p:|s:)/g;
function resolveLabel(tag) {
  return tag.replace(tagRegExp, "");
}
function slug(str) {
  return str.replaceAll(" ", "-").toLowerCase();
}
const placeholder = {
  name: "Placeholder",
  male: "place",
  female: "place",
  genderOnly: false,
  metaData: {
    src: "local",
    tags: []
  }
};
const malePortraits = [];
const femalePortraits = [];
const listOfBreeds = [placeholder];
function useTreeAnalyser(tree, handler, capacity = 5) {
  const history = useTreeHistory(tree, capacity);
  const selectionCount = ref(0);
  const usedBreeds = ref(/* @__PURE__ */ new Map());
  watchEffect(() => {
    if (tree.value === null) return;
    const breeds = /* @__PURE__ */ new Map();
    let selected = 0;
    unref(handler).every((dragon) => {
      breeds.set(dragon.breed, (breeds.get(dragon.breed) ?? 0) + 1);
      if (dragon.selected) selected++;
    });
    breeds.delete(placeholder.name);
    usedBreeds.value = breeds;
    selectionCount.value = selected;
  });
  return {
    history,
    usedBreeds,
    selectionCount
  };
}
async function callAPI(url, options = {}) {
  const config = /* @__PURE__ */ useRuntimeConfig();
  return $fetch(url, {
    ...options,
    baseURL: `${config.public.baseUrl}/api`
  });
}
function saveLineage(tree) {
  return callAPI("/lineage", {
    method: "POST",
    body: {
      lineage: tree
    }
  });
}
function Lineage(treeRef) {
  if (typeof treeRef === "undefined")
    return new LineageHandler(DragonBuilder.create());
  return new LineageHandler(treeRef);
}
class LineageHandler {
  constructor(treeRef) {
    this.tree = treeRef;
  }
  /**
   * Count number of dragons in the lineage.
   */
  count(where, value) {
    let count = 0;
    this.every((dragon) => {
      if (typeof where === "string") {
        if (dragon[where] === value) {
          count++;
          return;
        }
      }
      count++;
    });
    return count;
  }
  /**
   * Recursively iterate through each dragon in the lineage.
   * @param callback Callback to execute on each dragon.
   */
  every(callback) {
    const raw = this.raw();
    const analyse = (dragon) => {
      callback(dragon);
      if (hasParents(dragon)) {
        analyse(dragon.parents.f);
        analyse(dragon.parents.m);
      }
    };
    analyse(raw);
    return raw;
  }
  /**
   * Get list of breeds and counts
   */
  breeds() {
    const breeds = /* @__PURE__ */ new Map();
    this.every(
      (dragon) => breeds.set(dragon.breed, (breeds.get(dragon.breed) ?? 0) + 1)
    );
    breeds.delete(placeholder.name);
    return breeds;
  }
  /**
   * Get raw lineage as a JSON object without getters or setters.
   */
  raw() {
    return cloneFnJSON(this.tree);
  }
  /**
   * Get the lineage with metadata excluded e.g. selected
   */
  withoutMetadata() {
    const get = function(dragon) {
      const { code, name, breed, gender, display } = dragon;
      return {
        code,
        name,
        breed,
        gender,
        display,
        parents: hasParents(dragon) ? {
          f: get(dragon.parents.f),
          m: get(dragon.parents.m)
        } : {}
      };
    };
    return new LineageHandler(get(this.tree));
  }
  withMetadata() {
    return new LineageHandler(
      this.every(
        (dragon) => dragon.selected = false
      )
    );
  }
  /**
   * Scan the lineage and count the number of generations.
   */
  generations() {
    let max = 1;
    const scan = (dragon, x) => {
      if (hasParents(dragon)) {
        scan(dragon.parents.m, x + 1);
        scan(dragon.parents.f, x + 1);
      } else if (x > max) max = x;
    };
    scan(this.tree, 1);
    return max;
  }
  getAtPath(path) {
    if (path === "") return this;
    const p = path.split(".").filter((v) => v !== "parents");
    let node = this.tree;
    for (let i = 0; i < p.length; ++i) {
      const parentGender = p[i];
      if (!["m", "f"].includes(parentGender)) {
        throw new Error(`bad gender: ${parentGender}`);
      }
      if (parentGender in node.parents) {
        node = node.parents[parentGender];
      } else {
        return void 0;
      }
    }
    return new LineageHandler(node);
  }
  async saveToServer() {
    const gens = this.generations();
    const legit = await dragonSchema.test(
      "generation-count",
      () => `The generation count is too short or too long. Lineages must
        be between ${settings.gens.min} and ${settings.gens.max}
        generations long inclusively.`,
      () => validateGenerationCount(gens)
    ).validate(this.withoutMetadata().raw());
    return createLineageLink((await saveLineage(legit)).hash);
  }
  // Takes a parents object and switches the two
  // If null, returns null
  switchParents() {
    if (!hasParents(this.tree)) return this;
    const switched = (dragon) => {
      const newGender = dragon.gender === "f" ? "m" : "f";
      const breed = getBreedData(dragon.breed);
      if (breed.genderOnly) dragon.breed = placeholder.name;
      dragon.gender = newGender;
      return dragon;
    };
    const copy = this.raw();
    return new LineageHandler({
      ...copy,
      parents: {
        m: switched(copy.parents.f),
        f: switched(copy.parents.m)
      }
    });
  }
}
const version = "6.9.5";
const useAppStore = defineStore("appStore", () => {
  const appVersion = version;
  const activeTree = ref(DragonBuilder.createWithMetadata());
  const activeLineage = computed(
    () => new LineageHandler(activeTree.value)
  );
  const analytics = useTreeAnalyser(activeTree, activeLineage, 5);
  function replaceRoot(node) {
    activeTree.value = node;
  }
  function addDescendant() {
    if (activeTree.value === null) return;
    const newTree = DragonBuilder.createWithMetadata({
      parents: activeTree.value.gender === "f" ? {
        f: activeTree.value,
        m: DragonBuilder.createWithMetadata({ gender: "m" })
      } : {
        f: DragonBuilder.createWithMetadata({ gender: "f" }),
        m: activeTree.value
      }
    });
    activeTree.value = newTree;
  }
  return {
    appVersion,
    activeTree,
    usedBreeds: analytics.usedBreeds,
    selectionCount: analytics.selectionCount,
    treeHistory: analytics.history,
    activeLineage,
    addDescendant,
    replaceRoot
  };
});
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "TheHeaderMenuLinks",
  __ssrInlineRender: true,
  setup(__props) {
    const links = [
      ["/", "Build"],
      ["/checkers", "Checker Generator"],
      ["/ghost-breeds", "Ghost breeds"],
      ["/onsite-preview", "Onsite Preview"],
      ["/inbred-checker", "Inbred Checker"],
      ["/tutorial", "Tutorial"],
      ["/about", "About"]
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<nav${ssrRenderAttrs(_attrs)}><!--[-->`);
      ssrRenderList(links, ([url, label]) => {
        _push(ssrRenderComponent(_component_RouterLink, {
          key: label,
          to: url
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="link-text"${_scopeId}>${ssrInterpolate(label)}</span>`);
            } else {
              return [
                createVNode("span", { class: "link-text" }, toDisplayString(label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--><a href="https://chazza.me/dc/tools"><span class="link-text"> More tools </span></a><a href="https://dragcave.net/"><span class="link-text"> Dragcave.net `);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: "external-link" }, null, _parent));
      _push(`</span></a></nav>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TheHeaderMenuLinks.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const TheHeaderMenuLinks = Object.assign(_sfc_main$8, { __name: "TheHeaderMenuLinks" });
const __default__ = {
  inheritAttrs: false
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  ...__default__,
  __name: "TheSlideInMenu",
  __ssrInlineRender: true,
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const mobileMenu = ref();
    const scrollLockDoc = useScrollLock((void 0).documentElement, false);
    const scrollLockBody = useScrollLock((void 0).body, false);
    const { activate, deactivate, hasFocus } = useFocusTrap(mobileMenu, {
      onActivate() {
        scrollLockBody.value = true;
        scrollLockDoc.value = true;
      },
      onDeactivate() {
        scrollLockBody.value = false;
        scrollLockDoc.value = false;
      }
    });
    watchEffect(() => {
      if (props.open) {
        void nextTick(activate);
      } else {
        deactivate();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "mobileMenu",
        ref: mobileMenu,
        class: "slide-in-menu-container",
        hidden: !__props.open
      }, _attrs))}>`);
      if (unref(hasFocus)) {
        _push(`<div class="blackout"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "slide-in-menu-wrapper" }, _ctx.$attrs, {
        class: {
          open: unref(hasFocus)
        }
      }))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TheSlideInMenu.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const TheSlideInMenu = Object.assign(_sfc_main$7, { __name: "TheSlideInMenu" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "TheHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const menuOpen = ref(false);
    const invitationOpen = ref(false);
    const inviteDismissed = useLocalStorage("inviteDismissed", false);
    onKeyDown("Escape", () => menuOpen.value = false);
    router.afterEach(() => menuOpen.value = false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<!--[-->`);
      if (!unref(inviteDismissed)) {
        _push(`<img id="garden-mint" src="https://dragcave.net/image/rnTk.gif" alt="Garden mint">`);
      } else {
        _push(`<!---->`);
      }
      if (invitationOpen.value) {
        _push(`<div id="garden-message"><p> Pssst! I&#39;m Matthias the Mint dragon, here to invite you to the <a href="https://chazza.me/dc/hatchery">Garden of Eden</a> — a brand new hatchery! <button type="button"> Begone, Matthias! </button></p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<a href="#content" class="sr-only">Skip to content</a><header id="top">`);
      _push(ssrRenderComponent(TheSlideInMenu, {
        id: "mobile-menu-wrapper",
        open: menuOpen.value,
        onChange: (state) => menuOpen.value = state
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div id="mobile-menu-top" class="mobile-menu-section"${_scopeId}><button class="menu-button pointer" type="button"${_scopeId}> Close `);
            _push2(ssrRenderComponent(unref(FontAwesomeIcon), {
              icon: "times",
              class: "icon"
            }, null, _parent2, _scopeId));
            _push2(`</button></div>`);
            _push2(ssrRenderComponent(TheHeaderMenuLinks, { id: "mobile-menu" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", {
                id: "mobile-menu-top",
                class: "mobile-menu-section"
              }, [
                createVNode("button", {
                  class: "menu-button pointer",
                  type: "button",
                  onClick: ($event) => menuOpen.value = false
                }, [
                  createTextVNode(" Close "),
                  createVNode(unref(FontAwesomeIcon), {
                    icon: "times",
                    class: "icon"
                  })
                ], 8, ["onClick"])
              ]),
              createVNode(TheHeaderMenuLinks, { id: "mobile-menu" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div id="header" class="constrain-width"><button id="mobile-menu-button" class="col-1 menu-button pointer" type="button">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), {
        id: "burger",
        icon: "bars"
      }, null, _parent));
      _push(` Menu </button><span id="site-title">`);
      _push(ssrRenderComponent(_component_router_link, {
        id: "site-title-link",
        to: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Lineage Builder `);
          } else {
            return [
              createTextVNode("Lineage Builder ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</span>`);
      _push(ssrRenderComponent(TheHeaderMenuLinks, { id: "desktop-menu" }, null, _parent));
      _push(`</div></header><!--]-->`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TheHeader.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const Header = Object.assign(_sfc_main$6, { __name: "TheHeader" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "BaseDialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean, default: false },
    id: { default: "" }
  },
  emits: ["instance", "dialogMounted", "close", "open"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const dialog = useTemplateRef("dialog");
    const closing = ref(false);
    watch(
      () => props.open,
      async (newVal) => {
        await nextTick();
        if (!dialog.value) {
          return;
        }
        if (newVal) {
          dialog.value.showModal();
        }
      }
    );
    function close() {
      if ((void 0).matchMedia("(prefers-reduced-motion: reduce)").matches) {
        dialog.value?.close();
        emit("close");
      } else {
        closing.value = true;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<dialog${ssrRenderAttrs(mergeProps({
        id: _ctx.id,
        ref_key: "dialog",
        ref: dialog,
        class: ["dialog", {
          closing: closing.value
        }]
      }, _attrs))}><div class="dialog-inner"><header class="dialog-header"><h1 class="dialog-header-title">`);
      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
        _push(`Dialog title Quick Brown Fox`);
      }, _push, _parent);
      _push(`</h1><div class="dialog-buttons"><button class="button close-button" type="button" aria-label="Close dialog" title="Close dialog">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), {
        size: "2x",
        icon: "times"
      }, null, _parent));
      _push(`</button></div></header><main class="dialog-main">`);
      ssrRenderSlot(_ctx.$slots, "default", {
        dialog: { close }
      }, () => {
        _push(`Default content`);
      }, _push, _parent);
      _push(`</main><footer class="dialog-footer">`);
      ssrRenderSlot(_ctx.$slots, "footer", {
        dialog: { close }
      }, () => {
        _push(`<button class="dialog-footer-button"> Close </button>`);
      }, _push, _parent);
      _push(`</footer></div></dialog>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BaseDialog.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const BaseDialog = Object.assign(_sfc_main$5, { __name: "BaseDialog" });
const defaultSkinId = "skin-default";
const availableSkins = {
  [defaultSkinId]: "Default",
  "skin-portal2": "Portal 2",
  "skin-portal2-light": "Portal 2 Light",
  "skin-mobile-dark": "Mobile/Tablet Dark"
};
const userSettings = useLocalStorage("settings", {
  gridThreshold: 20,
  skin: defaultSkinId
});
watch(
  () => userSettings.value.skin,
  (newSkin) => {
    if (!(newSkin in availableSkins)) {
      userSettings.value.skin = defaultSkinId;
    }
    (void 0).body.className = newSkin;
  },
  { immediate: true }
);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "SkinSwitcher",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: { default: "" }
  }, {
    "modelValue": {
      type: String,
      default: ""
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<select${ssrRenderAttrs(mergeProps({
        id: _ctx.id,
        class: "skin-switcher pointer interactive"
      }, _ctx.$attrs, _attrs))}><!--[-->`);
      ssrRenderList(unref(availableSkins), (readableName, skinId) => {
        _push(`<option${ssrRenderAttr("value", skinId)}${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, skinId) : ssrLooseEqual(model.value, skinId)) ? " selected" : ""}>${ssrInterpolate(readableName)}</option>`);
      });
      _push(`<!--]--></select>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SkinSwitcher.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const SkinSwitcher = Object.assign(_sfc_main$4, { __name: "SkinSwitcher" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DialogSettings",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const settingsDialogId = useId();
    const temporarySettings = ref({ ...userSettings.value });
    const emit = __emit;
    const props = __props;
    watch(
      () => props.open,
      (open) => {
        if (open) {
          temporarySettings.value = { ...userSettings.value };
        }
      }
    );
    function resetTemporarySettings() {
      temporarySettings.value = { ...userSettings.value };
    }
    function saveSettings() {
      userSettings.value = { ...userSettings.value, ...temporarySettings.value };
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BaseDialog, mergeProps({
        id: unref(settingsDialogId),
        open: _ctx.open,
        onClose: ($event) => {
          resetTemporarySettings();
          emit("close");
        }
      }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Settings`);
          } else {
            return [
              createTextVNode("Settings")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form id="settings-form" data-v-b466d267${_scopeId}><label for="grid-threshold" data-v-b466d267${_scopeId}>Grid threshold</label><input id="grid-threshold"${ssrRenderAttr("value", temporarySettings.value.gridThreshold)} class="interactive" type="number" name="grid-threshold" min="0" data-v-b466d267${_scopeId}><p data-v-b466d267${_scopeId}> Show results in a grid when there are more than ${ssrInterpolate(temporarySettings.value.gridThreshold)} results. </p><label for="skin-switcher" data-v-b466d267${_scopeId}>Skin</label>`);
            _push2(ssrRenderComponent(SkinSwitcher, {
              id: "skin-switcher",
              modelValue: temporarySettings.value.skin,
              "onUpdate:modelValue": ($event) => temporarySettings.value.skin = $event
            }, null, _parent2, _scopeId));
            _push2(`<p data-v-b466d267${_scopeId}>Emulate a site skin.</p></form>`);
          } else {
            return [
              createVNode("form", { id: "settings-form" }, [
                createVNode("label", { for: "grid-threshold" }, "Grid threshold"),
                withDirectives(createVNode("input", {
                  id: "grid-threshold",
                  "onUpdate:modelValue": ($event) => temporarySettings.value.gridThreshold = $event,
                  class: "interactive",
                  type: "number",
                  name: "grid-threshold",
                  min: "0",
                  onChange: ($event) => temporarySettings.value.gridThreshold = Math.abs(
                    ~~Number($event.target?.value ?? "0")
                  )
                }, null, 40, ["onUpdate:modelValue", "onChange"]), [
                  [
                    vModelText,
                    temporarySettings.value.gridThreshold,
                    void 0,
                    { number: true }
                  ]
                ]),
                createVNode("p", null, " Show results in a grid when there are more than " + toDisplayString(temporarySettings.value.gridThreshold) + " results. ", 1),
                createVNode("label", { for: "skin-switcher" }, "Skin"),
                createVNode(SkinSwitcher, {
                  id: "skin-switcher",
                  modelValue: temporarySettings.value.skin,
                  "onUpdate:modelValue": ($event) => temporarySettings.value.skin = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode("p", null, "Emulate a site skin.")
              ])
            ];
          }
        }),
        footer: withCtx(({ dialog }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="dialog-footer-button" data-v-b466d267${_scopeId}> Cancel </button><button class="dialog-footer-button" data-v-b466d267${_scopeId}> Save </button>`);
          } else {
            return [
              createVNode("button", {
                class: "dialog-footer-button",
                onClick: ($event) => dialog.close()
              }, " Cancel ", 8, ["onClick"]),
              createVNode("button", {
                class: "dialog-footer-button",
                onClick: ($event) => {
                  saveSettings();
                  dialog.close();
                }
              }, " Save ", 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DialogSettings.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const DialogSettings = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-b466d267"]]), { __name: "DialogSettings" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const appStore = useAppStore();
    const settingsDialogOpen = ref(false);
    const { pixelRatio } = useDevicePixelRatio();
    let use72 = false;
    watch(
      pixelRatio,
      async () => {
        if (pixelRatio.value > 1) {
          await Promise.all([
            Promise.resolve({                          }),
            Promise.resolve({                          }),
            Promise.resolve({                          }),
            Promise.resolve({                          }),
            Promise.resolve({                          }),
            Promise.resolve({                          })
          ]);
          use72 = true;
        } else if (!use72) {
          await Promise.all([
            Promise.resolve({                          }),
            Promise.resolve({                          }),
            Promise.resolve({                          }),
            Promise.resolve({                          }),
            Promise.resolve({                          }),
            Promise.resolve({                          })
          ]);
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(DialogSettings, {
        open: settingsDialogOpen.value,
        onClose: ($event) => settingsDialogOpen.value = false
      }, null, _parent));
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main id="content">`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</main><footer id="bottom"><div id="footer" class="constrain-width"><div id="footer-links"><a href="https://ko-fi.com/dctools">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), {
        icon: "fa-solid fa-mug-hot",
        size: "2x"
      }, null, _parent));
      _push(`Donation link </a><a href="https://github.com/edenchazard/dc-lineage-builder">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), {
        icon: "fa-brands fa-github",
        size: "2x"
      }, null, _parent));
      _push(`Github </a><button class="pointer" type="button">`);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), {
        icon: "fa-solid fa-cog",
        size: "2x"
      }, null, _parent));
      _push(`Settings </button></div><div id="footer-version"> v${ssrInterpolate(unref(appStore).appVersion)} <div>eden chazard</div></div></div></footer><!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-BM0HilLH.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-kl4HApHi.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { userSettings as A, BaseDialog as B, useScroll as C, DragonBuilder as D, useShare as E, useDebounceFn as F, settings as G, BREEDNAMEREGEXP as H, createLineageLink as I, Lineage as L, _export_sfc as _, useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, dragonSchema as d, entry$1 as default, useAppStore as e, useResizeObserver as f, femalePortraits as g, useSessionStorage as h, getTable as i, useFullscreen as j, hasParents as k, listOfBreeds as l, malePortraits as m, navigateTo as n, onStartTyping as o, placeholder as p, useScrollLock as q, resolveRouteObject as r, getBreedData as s, breedEntryToPortrait as t, useRouter as u, expandGender as v, validateName as w, validateCode as x, resolveLabel as y, slug as z };
//# sourceMappingURL=server.mjs.map
