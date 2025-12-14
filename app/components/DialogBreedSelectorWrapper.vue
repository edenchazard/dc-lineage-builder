<template>
  <dialog
    id="breed-selector-wrapper"
    :ref="breedSelectorDialog.dialogRef"
    class="dialog no-transition"
    aria-labelledby="dialog-breed-selector-wrapper"
    @click="
      (event) => {
        if (
          breedSelectorDialog.dialogRef.value &&
          (event.target as HTMLDialogElement)?.isSameNode(
            breedSelectorDialog.dialogRef.value,
          )
        ) {
          breedSelectorDialog.hide();
        }
      }
    "
  >
    <div class="dialog-inner">
      <header class="dialog-header">
        <h1
          id="dialog-breed-selector-wrapper"
          class="dialog-header-title"
        >
          <slot name="title">Choose a breed</slot>
        </h1>

        <div class="dialog-buttons">
          <button
            class="button close-button"
            type="button"
            title="Close"
            @click="breedSelectorDialog.hide()"
          >
            <FontAwesomeIcon
              size="2x"
              icon="times"
            />
          </button>
        </div>
      </header>
      <main class="dialog-main">
        <slot name="content" />
      </main>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import useBreedSelector from '~/composables/useBreedSelector';
const breedSelectorDialog = useBreedSelector();
</script>

<style scoped>
#breed-selector-wrapper {
  flex-direction: column;
  overscroll-behavior: contain;
  max-height: 500px;
  height: 100%;
  box-shadow: 2px 2px 20px 1px #000;
}
</style>
