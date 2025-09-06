
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)


export const BaseDialog: typeof import("../components/BaseDialog.vue")['default']
export const BreedList: typeof import("../components/BreedList.vue")['default']
export const BreedListFilterDropdown: typeof import("../components/BreedListFilterDropdown.vue")['default']
export const BreedListFiltered: typeof import("../components/BreedListFiltered.vue")['default']
export const BreedSearch: typeof import("../components/BreedSearch.vue")['default']
export const BreedTag: typeof import("../components/BreedTag.vue")['default']
export const DialogBreedSelector: typeof import("../components/DialogBreedSelector.vue")['default']
export const DialogBreedSelectorWrapper: typeof import("../components/DialogBreedSelectorWrapper.vue")['default']
export const DialogExport: typeof import("../components/DialogExport.vue")['default']
export const DialogGenerate: typeof import("../components/DialogGenerate.vue")['default']
export const DialogImport: typeof import("../components/DialogImport.vue")['default']
export const DialogSettings: typeof import("../components/DialogSettings.vue")['default']
export const DragonPortrait: typeof import("../components/DragonPortrait.vue")['default']
export const DragonProblem: typeof import("../components/DragonProblem.vue")['default']
export const FeedbackPanel: typeof import("../components/FeedbackPanel.vue")['default']
export const GhostBreedUpload: typeof import("../components/GhostBreedUpload.vue")['default']
export const InputTextbox: typeof import("../components/InputTextbox.vue")['default']
export const LineageBuilder: typeof import("../components/LineageBuilder.vue")['default']
export const LineageBuilderToolbar: typeof import("../components/LineageBuilderToolbar.vue")['default']
export const LineageView: typeof import("../components/LineageView.vue")['default']
export const LineageViewGenerationCounter: typeof import("../components/LineageViewGenerationCounter.vue")['default']
export const LineageViewNode: typeof import("../components/LineageViewNode.vue")['default']
export const LineageViewNodeButton: typeof import("../components/LineageViewNodeButton.vue")['default']
export const LineageViewNodeLabel: typeof import("../components/LineageViewNodeLabel.vue")['default']
export const LineageWrapper: typeof import("../components/LineageWrapper.vue")['default']
export const OnsitePreview: typeof import("../components/OnsitePreview.vue")['default']
export const SkinSwitcher: typeof import("../components/SkinSwitcher.vue")['default']
export const TheHeader: typeof import("../components/TheHeader.vue")['default']
export const TheHeaderMenuLinks: typeof import("../components/TheHeaderMenuLinks.vue")['default']
export const TheSlideInMenu: typeof import("../components/TheSlideInMenu.vue")['default']
export const ToolbarButton: typeof import("../components/ToolbarButton.vue")['default']
export const ToolbarDropDownMenu: typeof import("../components/ToolbarDropDownMenu.vue")['default']
export const ToolbarDropDownMenuItem: typeof import("../components/ToolbarDropDownMenuItem.vue")['default']
export const ToolbarGroup: typeof import("../components/ToolbarGroup.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyBaseDialog: LazyComponent<typeof import("../components/BaseDialog.vue")['default']>
export const LazyBreedList: LazyComponent<typeof import("../components/BreedList.vue")['default']>
export const LazyBreedListFilterDropdown: LazyComponent<typeof import("../components/BreedListFilterDropdown.vue")['default']>
export const LazyBreedListFiltered: LazyComponent<typeof import("../components/BreedListFiltered.vue")['default']>
export const LazyBreedSearch: LazyComponent<typeof import("../components/BreedSearch.vue")['default']>
export const LazyBreedTag: LazyComponent<typeof import("../components/BreedTag.vue")['default']>
export const LazyDialogBreedSelector: LazyComponent<typeof import("../components/DialogBreedSelector.vue")['default']>
export const LazyDialogBreedSelectorWrapper: LazyComponent<typeof import("../components/DialogBreedSelectorWrapper.vue")['default']>
export const LazyDialogExport: LazyComponent<typeof import("../components/DialogExport.vue")['default']>
export const LazyDialogGenerate: LazyComponent<typeof import("../components/DialogGenerate.vue")['default']>
export const LazyDialogImport: LazyComponent<typeof import("../components/DialogImport.vue")['default']>
export const LazyDialogSettings: LazyComponent<typeof import("../components/DialogSettings.vue")['default']>
export const LazyDragonPortrait: LazyComponent<typeof import("../components/DragonPortrait.vue")['default']>
export const LazyDragonProblem: LazyComponent<typeof import("../components/DragonProblem.vue")['default']>
export const LazyFeedbackPanel: LazyComponent<typeof import("../components/FeedbackPanel.vue")['default']>
export const LazyGhostBreedUpload: LazyComponent<typeof import("../components/GhostBreedUpload.vue")['default']>
export const LazyInputTextbox: LazyComponent<typeof import("../components/InputTextbox.vue")['default']>
export const LazyLineageBuilder: LazyComponent<typeof import("../components/LineageBuilder.vue")['default']>
export const LazyLineageBuilderToolbar: LazyComponent<typeof import("../components/LineageBuilderToolbar.vue")['default']>
export const LazyLineageView: LazyComponent<typeof import("../components/LineageView.vue")['default']>
export const LazyLineageViewGenerationCounter: LazyComponent<typeof import("../components/LineageViewGenerationCounter.vue")['default']>
export const LazyLineageViewNode: LazyComponent<typeof import("../components/LineageViewNode.vue")['default']>
export const LazyLineageViewNodeButton: LazyComponent<typeof import("../components/LineageViewNodeButton.vue")['default']>
export const LazyLineageViewNodeLabel: LazyComponent<typeof import("../components/LineageViewNodeLabel.vue")['default']>
export const LazyLineageWrapper: LazyComponent<typeof import("../components/LineageWrapper.vue")['default']>
export const LazyOnsitePreview: LazyComponent<typeof import("../components/OnsitePreview.vue")['default']>
export const LazySkinSwitcher: LazyComponent<typeof import("../components/SkinSwitcher.vue")['default']>
export const LazyTheHeader: LazyComponent<typeof import("../components/TheHeader.vue")['default']>
export const LazyTheHeaderMenuLinks: LazyComponent<typeof import("../components/TheHeaderMenuLinks.vue")['default']>
export const LazyTheSlideInMenu: LazyComponent<typeof import("../components/TheSlideInMenu.vue")['default']>
export const LazyToolbarButton: LazyComponent<typeof import("../components/ToolbarButton.vue")['default']>
export const LazyToolbarDropDownMenu: LazyComponent<typeof import("../components/ToolbarDropDownMenu.vue")['default']>
export const LazyToolbarDropDownMenuItem: LazyComponent<typeof import("../components/ToolbarDropDownMenuItem.vue")['default']>
export const LazyToolbarGroup: LazyComponent<typeof import("../components/ToolbarGroup.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
