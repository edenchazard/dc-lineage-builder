import { readonly, ref } from 'vue';
import type { PartialLineageWithMetadata, PortraitData } from '../shared/types';
import { useScrollLock } from '@vueuse/core';

// we want to hide the scroll bar when the popup is open,
// and, we'd also like to prevent overscroll happening.
const scrollLockDoc = useScrollLock(document.documentElement, false);
const scrollLockBody = useScrollLock(document.body, false);
const dialogRef = ref<HTMLDialogElement>();
const autofocus = ref(false);
const forGender = ref<PartialLineageWithMetadata['gender']>();
let breedSelectedCallback: ((breed: PortraitData) => void) | null;

interface UseBreedSelectorOptions {
  autofocus?: boolean;
  forGender: PartialLineageWithMetadata['gender'];
  breedSelectedCallback?: (breed: PortraitData) => void;
}

function show(options: UseBreedSelectorOptions) {
  const _options = {
    autofocus: false,
    breedSelectedCallback: null,
    ...options,
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
  const results = dialogRef.value?.querySelector('.results');

  if (results) {
    results.scrollTop = 0;
  }

  // FIX: Hiding the dialog won't reset the roving tab index.
  // We need to manually reset it.
  const tabIndexes = dialogRef.value?.querySelectorAll(
    '[data-roving-tabindex]',
  );
  tabIndexes?.forEach((el) => {
    el.setAttribute('tabindex', '-1');
  });
  tabIndexes?.[0]?.setAttribute('tabindex', '0');

  autofocus.value = false;
  if (dialogRef.value) {
    dialogRef.value.close();
    dialogRef.value.dataset.openTime = '';
  }
  breedSelectedCallback = null;
  scrollLockDoc.value = scrollLockBody.value = false;
}

function handleBreedSelected(breed: PortraitData) {
  if (breedSelectedCallback) {
    breedSelectedCallback(breed);
  }
}

export default function useBreedSelector() {
  return {
    dialogRef,
    autofocus: readonly(autofocus),
    forGender: readonly(forGender),
    show,
    hide,
    handleBreedSelected,
  };
}
