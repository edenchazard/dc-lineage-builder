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
      <form @submit="addToEntries">
        <div>
          <label for="name">Breed name: </label>
          <input
            type="text"
            id="name"
            name="name"
            v-model="name"
          />
        </div>
        <div>
          <span class="field-label">Gender availability:</span>
          <input
            type="radio"
            v-model="genderAvailability"
            id="avail_both"
            value="b"
          />
          <label for="avail_both">Both</label>
          <input
            type="radio"
            v-model="genderAvailability"
            id="avail_male"
            value="m"
          />
          <label for="avail_male">Male-only</label>
          <input
            type="radio"
            v-model="genderAvailability"
            id="avail_female"
            value="f"
          />
          <label for="avail_female">Female-only</label>
        </div>
        <div>
          <span class="field-label">Tiles</span>
          <div id="tile-upload">
            <div v-show="['b', 'm'].includes(genderAvailability)">
              <label for="male">Male</label>
              <GhostBreedUpload
                label="male"
                @tileChosen="(base64) => portraitSelected('m', base64)"
                @uploadError="uploadError"
              />
            </div>
            <div v-show="['b', 'f'].includes(genderAvailability)">
              <label for="female">Female</label>
              <GhostBreedUpload
                label="female"
                @tileChosen="(base64) => portraitSelected('f', base64)"
                @uploadError="uploadError"
              />
            </div>
          </div>
        </div>
        <button
          class="themed-button"
          type="submit"
        >
          Add breed
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { BreedEntry, Gender } from '../../app/types';
import { addBreed } from '../../app/utils';
import settings from '../../app/settings';
import GhostBreedUpload from './GhostBreedUpload.vue';
import Feedback from '../../components/UI/Feedback.vue';
type Availability = 'b' | Gender;

const name = ref('');
// b for both
const genderAvailability = ref<Availability>('b');
const femaleBase64 = ref('');
const maleBase64 = ref('');
const status = ref<InstanceType<typeof Feedback>>();

function portraitSelected(gender: Gender, base64: string) {
  if (gender === 'm') maleBase64.value = base64;
  else if (gender === 'f') femaleBase64.value = base64;
}

function uploadError() {
  if (!status.value) return;
  status.value.error('Upload error.');
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

  // there was an issue creating the props
  if (!genderProps) return;

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
.field-label {
  font-weight: bold;
}

#tile-upload {
  display: flex;
  flex-direction: row;
  text-align: center;
}
</style>
