<template>
  <dialog
    id="breed-selector-wrapper"
    :ref="breedSelectorDialog.dialogRef"
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
import useBreedSelector from '../composables/useBreedSelector';
const breedSelectorDialog = useBreedSelector();
</script>

<style scoped>
#breed-selector-wrapper {
  z-index: 1000;
  flex-direction: column;
  overscroll-behavior: contain;
  background: var(--dialog-body-bg);
  padding: 0;
  border: 0;
}

.dialog-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dialog-main {
  flex: 1;
  display: flex;
  overflow: auto;
  flex-direction: column;
  padding: 0.5rem;
}

@media only screen and (min-width: 504px) {
  #breed-selector-wrapper {
    width: 503px;
    box-shadow: 0px 0px 200px 0px #000;
    margin-left: -250px;
    left: 50%;
  }
}

@media only screen and (min-height: 501px) {
  #breed-selector-wrapper {
    height: 500px;
    margin-top: -250px;
    top: 50%;
    box-shadow: 2px 2px 20px 1px #000;
  }
}
</style>
