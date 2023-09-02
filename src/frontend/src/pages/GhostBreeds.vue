<template>
  <div class="central-block">
    <Feedback ref="status" />
    <section>
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
    <section>
      <form
        id="add-ghost-breed"
        @submit="addToEntries"
      >
        <div class="grid">
          <label
            class="field-label"
            for="name"
            >Breed name</label
          >
          <input
            id="name"
            v-model="name"
            type="text"
            name="name"
            required
            title="Breed name must be alphanumeric and 1-32 characters long."
            :pattern="BREEDNAMEREGEXP.toString().slice(2, -2)"
          />
          <span class="field-label">DragonGender availability</span>
          <div class="column">
            <label
              ><input
                id="avail_both"
                v-model="genderAvailability"
                type="radio"
                value="b"
              />
              Both</label
            >
            <label
              ><input
                id="avail_male"
                v-model="genderAvailability"
                type="radio"
                value="m"
              />
              Male-only</label
            >
            <label
              ><input
                id="avail_female"
                v-model="genderAvailability"
                type="radio"
                value="f"
              />
              Female-only</label
            >
          </div>
          <span class="field-label">Tiles</span>
          <div class="row tiles">
            <div
              v-if="['b', 'm'].includes(genderAvailability)"
              class="column"
            >
              <GhostBreedUpload
                ref="maleTile"
                label="male"
                aria-required="true"
                :class="{ invalid: maleBase64 === '' }"
                @tile-chosen="(base64) => portraitSelected('m', base64)"
                @upload-error="uploadError"
              />
              <label for="male">Male </label>
            </div>
            <div
              v-if="['b', 'f'].includes(genderAvailability)"
              class="column"
            >
              <GhostBreedUpload
                ref="femaleTile"
                label="female"
                aria-required="true"
                :class="{ invalid: femaleBase64 === '' }"
                @tile-chosen="(base64) => portraitSelected('f', base64)"
                @upload-error="uploadError"
              />
              <label for="female">Female</label>
            </div>
          </div>
        </div>
        <div class="row form-buttons">
          <button
            class="themed-button"
            type="submit"
          >
            Add breed
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import { BreedEntry, DragonGender } from '../app/types';
import { addBreed } from '../app/utils';
import settings from '../app/settings';
import GhostBreedUpload from '../components/GhostBreedUpload.vue';
import Feedback from '../components/UI/Feedback.vue';
import { BREEDNAMEREGEXP } from '../app/validators';

type Availability = 'b' | DragonGender;

const name = ref('Ghost Breed');
// b for both
const genderAvailability = ref<Availability>('b');
const femaleBase64 = ref('');
const maleBase64 = ref('');
const femaleTile = ref<InstanceType<typeof GhostBreedUpload>>();
const maleTile = ref<InstanceType<typeof GhostBreedUpload>>();
const status = ref<InstanceType<typeof Feedback>>();

// reset when availability changes
watch(genderAvailability, () => {
  maleBase64.value = femaleBase64.value = '';
});

function portraitSelected(gender: DragonGender, base64: string) {
  if (gender === 'm') maleBase64.value = base64;
  else if (gender === 'f') femaleBase64.value = base64;
}

function uploadError(error: string) {
  if (!status.value) return;
  status.value.error(`Upload error: ${error}.`);
}

function addToEntries(e: Event) {
  // don't submit form
  e.preventDefault();

  if (!status.value) return;

  // returns a set of specific properties depending
  // on the availability option selected
  const getGenderProps = (
    availability: Availability,
    male: string,
    female: string,
  ) => {
    if (availability === 'f') return { genderOnly: 'f', female };
    else if (availability === 'm') return { genderOnly: 'm', male };

    // default to both
    return { genderOnly: false, female, male };
  };

  // create gender props
  const genderProps = getGenderProps(
    genderAvailability.value,
    maleBase64.value,
    femaleBase64.value,
  );

  // Error when a tile is missing based on gender props
  // and focus the appropriate element.
  if (genderProps?.male === '') {
    status.value.error(`The male tile is missing.`);
    setTimeout(() => maleTile.value?.focus(), 100);
    return;
  }

  if (genderProps?.female === '') {
    status.value.error(`The female tile is missing.`);
    setTimeout(() => femaleTile.value?.focus(), 100);
    return;
  }

  // add the breed
  const breed: BreedEntry = {
    name: name.value,
    //...{ genderOnly: 2, female: "", male: "" },
    ...getGenderProps(
      genderAvailability.value,
      maleBase64.value,
      femaleBase64.value,
    ),
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
.grid {
  grid-template-columns: 1fr;
  gap: 5px;
}
.tiles > .column {
  margin: 5px;
  align-items: center;
}
.field-label {
  font-weight: bold;
}
.field-label::after {
  content: ':';
}

@media (min-width: 320px) {
  #add-ghost-breed {
    max-width: 400px;
  }
  .grid {
    grid-template-columns: 1fr 1fr;
  }
  .form-buttons {
    justify-content: right;
  }
}
</style>
