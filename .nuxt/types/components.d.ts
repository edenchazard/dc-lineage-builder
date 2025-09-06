
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

interface _GlobalComponents {
      'BaseDialog': typeof import("../../app/components/BaseDialog.vue")['default']
    'BreedList': typeof import("../../app/components/BreedList.vue")['default']
    'BreedListFilterDropdown': typeof import("../../app/components/BreedListFilterDropdown.vue")['default']
    'BreedListFiltered': typeof import("../../app/components/BreedListFiltered.vue")['default']
    'BreedSearch': typeof import("../../app/components/BreedSearch.vue")['default']
    'BreedTag': typeof import("../../app/components/BreedTag.vue")['default']
    'DialogBreedSelector': typeof import("../../app/components/DialogBreedSelector.vue")['default']
    'DialogBreedSelectorWrapper': typeof import("../../app/components/DialogBreedSelectorWrapper.vue")['default']
    'DialogExport': typeof import("../../app/components/DialogExport.vue")['default']
    'DialogGenerate': typeof import("../../app/components/DialogGenerate.vue")['default']
    'DialogImport': typeof import("../../app/components/DialogImport.vue")['default']
    'DialogSettings': typeof import("../../app/components/DialogSettings.vue")['default']
    'DragonPortrait': typeof import("../../app/components/DragonPortrait.vue")['default']
    'DragonProblem': typeof import("../../app/components/DragonProblem.vue")['default']
    'FeedbackPanel': typeof import("../../app/components/FeedbackPanel.vue")['default']
    'GhostBreedUpload': typeof import("../../app/components/GhostBreedUpload.vue")['default']
    'InputTextbox': typeof import("../../app/components/InputTextbox.vue")['default']
    'LineageBuilder': typeof import("../../app/components/LineageBuilder.vue")['default']
    'LineageBuilderToolbar': typeof import("../../app/components/LineageBuilderToolbar.vue")['default']
    'LineageView': typeof import("../../app/components/LineageView.vue")['default']
    'LineageViewGenerationCounter': typeof import("../../app/components/LineageViewGenerationCounter.vue")['default']
    'LineageViewNode': typeof import("../../app/components/LineageViewNode.vue")['default']
    'LineageViewNodeButton': typeof import("../../app/components/LineageViewNodeButton.vue")['default']
    'LineageViewNodeLabel': typeof import("../../app/components/LineageViewNodeLabel.vue")['default']
    'LineageWrapper': typeof import("../../app/components/LineageWrapper.vue")['default']
    'OnsitePreview': typeof import("../../app/components/OnsitePreview.vue")['default']
    'SkinSwitcher': typeof import("../../app/components/SkinSwitcher.vue")['default']
    'TheHeader': typeof import("../../app/components/TheHeader.vue")['default']
    'TheHeaderMenuLinks': typeof import("../../app/components/TheHeaderMenuLinks.vue")['default']
    'TheSlideInMenu': typeof import("../../app/components/TheSlideInMenu.vue")['default']
    'ToolbarButton': typeof import("../../app/components/ToolbarButton.vue")['default']
    'ToolbarDropDownMenu': typeof import("../../app/components/ToolbarDropDownMenu.vue")['default']
    'ToolbarDropDownMenuItem': typeof import("../../app/components/ToolbarDropDownMenuItem.vue")['default']
    'ToolbarGroup': typeof import("../../app/components/ToolbarGroup.vue")['default']
    'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyBaseDialog': LazyComponent<typeof import("../../app/components/BaseDialog.vue")['default']>
    'LazyBreedList': LazyComponent<typeof import("../../app/components/BreedList.vue")['default']>
    'LazyBreedListFilterDropdown': LazyComponent<typeof import("../../app/components/BreedListFilterDropdown.vue")['default']>
    'LazyBreedListFiltered': LazyComponent<typeof import("../../app/components/BreedListFiltered.vue")['default']>
    'LazyBreedSearch': LazyComponent<typeof import("../../app/components/BreedSearch.vue")['default']>
    'LazyBreedTag': LazyComponent<typeof import("../../app/components/BreedTag.vue")['default']>
    'LazyDialogBreedSelector': LazyComponent<typeof import("../../app/components/DialogBreedSelector.vue")['default']>
    'LazyDialogBreedSelectorWrapper': LazyComponent<typeof import("../../app/components/DialogBreedSelectorWrapper.vue")['default']>
    'LazyDialogExport': LazyComponent<typeof import("../../app/components/DialogExport.vue")['default']>
    'LazyDialogGenerate': LazyComponent<typeof import("../../app/components/DialogGenerate.vue")['default']>
    'LazyDialogImport': LazyComponent<typeof import("../../app/components/DialogImport.vue")['default']>
    'LazyDialogSettings': LazyComponent<typeof import("../../app/components/DialogSettings.vue")['default']>
    'LazyDragonPortrait': LazyComponent<typeof import("../../app/components/DragonPortrait.vue")['default']>
    'LazyDragonProblem': LazyComponent<typeof import("../../app/components/DragonProblem.vue")['default']>
    'LazyFeedbackPanel': LazyComponent<typeof import("../../app/components/FeedbackPanel.vue")['default']>
    'LazyGhostBreedUpload': LazyComponent<typeof import("../../app/components/GhostBreedUpload.vue")['default']>
    'LazyInputTextbox': LazyComponent<typeof import("../../app/components/InputTextbox.vue")['default']>
    'LazyLineageBuilder': LazyComponent<typeof import("../../app/components/LineageBuilder.vue")['default']>
    'LazyLineageBuilderToolbar': LazyComponent<typeof import("../../app/components/LineageBuilderToolbar.vue")['default']>
    'LazyLineageView': LazyComponent<typeof import("../../app/components/LineageView.vue")['default']>
    'LazyLineageViewGenerationCounter': LazyComponent<typeof import("../../app/components/LineageViewGenerationCounter.vue")['default']>
    'LazyLineageViewNode': LazyComponent<typeof import("../../app/components/LineageViewNode.vue")['default']>
    'LazyLineageViewNodeButton': LazyComponent<typeof import("../../app/components/LineageViewNodeButton.vue")['default']>
    'LazyLineageViewNodeLabel': LazyComponent<typeof import("../../app/components/LineageViewNodeLabel.vue")['default']>
    'LazyLineageWrapper': LazyComponent<typeof import("../../app/components/LineageWrapper.vue")['default']>
    'LazyOnsitePreview': LazyComponent<typeof import("../../app/components/OnsitePreview.vue")['default']>
    'LazySkinSwitcher': LazyComponent<typeof import("../../app/components/SkinSwitcher.vue")['default']>
    'LazyTheHeader': LazyComponent<typeof import("../../app/components/TheHeader.vue")['default']>
    'LazyTheHeaderMenuLinks': LazyComponent<typeof import("../../app/components/TheHeaderMenuLinks.vue")['default']>
    'LazyTheSlideInMenu': LazyComponent<typeof import("../../app/components/TheSlideInMenu.vue")['default']>
    'LazyToolbarButton': LazyComponent<typeof import("../../app/components/ToolbarButton.vue")['default']>
    'LazyToolbarDropDownMenu': LazyComponent<typeof import("../../app/components/ToolbarDropDownMenu.vue")['default']>
    'LazyToolbarDropDownMenuItem': LazyComponent<typeof import("../../app/components/ToolbarDropDownMenuItem.vue")['default']>
    'LazyToolbarGroup': LazyComponent<typeof import("../../app/components/ToolbarGroup.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
