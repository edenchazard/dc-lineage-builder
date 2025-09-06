<template>
  <div class="constrain-width content">
    <section class="content-limit">
      <h1>Ghost Breeds</h1>
      <p>
        On this page you can upload custom breeds, aka "ghost breeds", to
        Lineage Builder. This can be useful if you have breed you've created and
        want to see what it looks like in lineages. All you have to do is upload
        the lineage tile and fill in the settings.
      </p>
      <p>
        Ghost breeds will be added under the "Standard" and "Regular" tags and
        will only be active for the <strong>duration of the session</strong>. As
        soon as you exit the page they will be automatically deleted! The whole
        process takes place client-side, they are
        <strong>not uploaded</strong> to the server which means it doesn't break
        DC's artist agreement for sharing unreleased breeds.
      </p>
      <p>
        Ensure that names are unique and tiles are less than
        {{ settings.ghostBreedSize / 1000 }}KB. DC lineage tiles are 48Hx36W on
        lower resolutions and 96Hx72W on higher resolutions.
      </p>
    </section>
    <form
      id="form"
      class="form"
      @submit.prevent="addToEntries"
    >
      <label
        class="label"
        for="name"
        >Breed name</label
      >
      <input
        id="name"
        v-model="name"
        type="text"
        name="name"
        class="interactive"
        required
        title="Breed name must be alphanumeric and 1-32 characters long."
        :pattern="BREEDNAMEREGEXP.toString().slice(1, -1)"
      />
      <span class="label">Gender availability</span>
      <div id="gender-availability">
        <input
          id="avail_both"
          v-model="genderAvailability"
          type="radio"
          value="b"
        />
        <label for="avail_both">Both</label>
        <input
          id="avail_male"
          v-model="genderAvailability"
          type="radio"
          value="m"
        />
        <label for="avail_male">Male-only</label>
        <input
          id="avail_female"
          v-model="genderAvailability"
          type="radio"
          value="f"
        />
        <label for="avail_female">Female-only</label>
      </div>
      <span class="label">Tiles</span>
      <div id="tiles">
        <template v-if="['b', 'm'].includes(genderAvailability)">
          <GhostBreedUpload
            ref="maleTile"
            label="male"
            aria-required="true"
            class="select"
            :class="{ invalid: maleBase64 === '' }"
            @tile-chosen="(base64) => portraitSelected('m', base64)"
            @upload-error="uploadError"
          />
          <label
            class="tile-label"
            for="male"
            >Male
          </label>
        </template>
        <template v-if="['b', 'f'].includes(genderAvailability)">
          <GhostBreedUpload
            ref="femaleTile"
            class="select"
            label="female"
            aria-required="true"
            :class="{ invalid: femaleBase64 === '' }"
            @tile-chosen="(base64) => portraitSelected('f', base64)"
            @upload-error="uploadError"
          />
          <label
            class="tile-label"
            for="female"
            >Female</label
          >
        </template>
      </div>
      <button
        type="submit"
        class="btn pointer"
      >
        Add breed
      </button>
    </form>
    <FeedbackPanel ref="status" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { BreedEntry, DragonGender } from '../shared/types';
import { addBreed } from '../shared/utils.js';
import { BREEDNAMEREGEXP } from '../shared/validation.js';
import settings from '../shared/settings.js';
import GhostBreedUpload from '../components/GhostBreedUpload.vue';
import FeedbackPanel from '../components/FeedbackPanel.vue';
import { useTemplateRef } from 'vue';

type Availability = 'b' | DragonGender;

const name = ref('Ghost Breed');
// b for both
const genderAvailability = ref<Availability>('b');
const femaleBase64 = ref('');
const maleBase64 = ref('');
const femaleTile = useTemplateRef('femaleTile');
const maleTile = useTemplateRef('maleTile');
const status = useTemplateRef('status');

function portraitSelected(gender: DragonGender, base64: string) {
  if (gender === 'm') maleBase64.value = base64;
  else if (gender === 'f') femaleBase64.value = base64;
}

function uploadError(error: string) {
  if (!status.value) return;
  status.value.error(`Upload error: ${error}.`);
}

function addToEntries() {
  if (!status.value) return;

  // create gender props
  const genderProps: Pick<BreedEntry, 'genderOnly' | 'male' | 'female'> = {
    genderOnly:
      genderAvailability.value === 'b' ? false : genderAvailability.value,
  };

  // Error when a tile is missing based on gender props
  // and focus the appropriate element.
  if (
    ['b', 'm'].includes(genderAvailability.value) &&
    maleBase64.value === ''
  ) {
    status.value.error(`The male tile is missing.`);
    setTimeout(() => maleTile.value?.focus(), 100);
    return;
  } else {
    genderProps.male = maleBase64.value;
  }

  if (
    ['b', 'f'].includes(genderAvailability.value) &&
    femaleBase64.value === ''
  ) {
    status.value.error(`The female tile is missing.`);
    setTimeout(() => femaleTile.value?.focus(), 100);
    return;
  } else {
    genderProps.female = femaleBase64.value;
  }

  // add the breed
  const breed: BreedEntry = {
    name: name.value,
    ...genderProps,
    metaData: {
      group: '*',
      tags: ['Regular'],
      src: 'ghost',
    },
  };

  if (addBreed(breed)) {
    // successfully added
    status.value.success(`Ghost breed "${name.value}" has been added.`);
  } else {
    status.value.error(
      `There was a problem adding the ghost breed. Please check that the name is valid and isn't already in use.`,
    );
  }
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}
#form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 20rem;
  width: 100%;
}
#gender-availability {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.5rem;
}

#tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;

  & :deep(.select) {
    grid-row: 1;
    margin: 0 auto;
  }
  & .tile-label {
    grid-row: 2;
    margin: 0 auto;
  }
}
</style>
