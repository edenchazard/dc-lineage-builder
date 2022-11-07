<template>
  <div class='central-block'>
    <Information :info="status" />
    <section>
      <p>On this page you can upload custom breeds, aka "ghost breeds", to Lineage Builder. This can be useful if you have breed you've created and want to see what it looks like in lineages. All you have to do is upload the lineage tile and fill in the settings.</p>
      <p>Ghost breeds will be added under the "Standard" and "Regular" tag and will only be active for the <strong>duration of the session</strong>, as soon as you exit the page they will be automatically deleted! Ghost breeds are also <strong>not uploaded</strong> to the server, the whole process takes place client-side. That means it doesn't break DC's artist agreement for sharing unreleased breed information.</p>
      <p>
        Please ensure that names are unique and tiles are less than 8KB. DC lineage tiles are 48px height and 36px width.
      </p>
    </section>
    <section>
      <form @submit="addToEntries">
        <div>
          <label for="name">Breed name: </label>
          <input type="text" id="name" name="name" v-model="name" />
        </div>
        <div>
          <span>Gender availability:</span>
          <input type="radio" v-model='genderAvailability' id="avail_both" value="b" />
          <label for="avail_both">Both</label>
          <input type="radio" v-model='genderAvailability' id="avail_male" value="m" />
          <label for="avail_male">Male-only</label>
          <input type="radio" v-model='genderAvailability' id="avail_female" value="f" />
          <label for="avail_female">Female-only</label>
        </div>
        <div>
          <span class='field-label'>Tile</span>
          <div v-if="genderAvailability === 'b'" id='tile-upload'>
            <div>
              <GhostBreedUpload
                @tileChosen = "(base64) => portraitSelected('m', base64)"
                @uploadError = "uploadError" />
              <span class='field-label'>Male</span>
            </div>
            <div>
              <GhostBreedUpload
                @tileChosen = "(base64) => portraitSelected('f', base64)"
                @uploadError = "uploadError" />
              <span class='field-label'>Female</span>
            </div>
          </div>
          <div v-if="genderAvailability === 'm'">
            <div>
              <GhostBreedUpload
                @tileChosen = "(base64) => portraitSelected('m', base64)"
                @uploadError = "uploadError" />
              <span class='field-label'>Male</span>
            </div>
          </div>
          <div v-if="genderAvailability === 'f'">
            <div>
              <GhostBreedUpload
                @tileChosen = "(base64) => portraitSelected('f', base64)"
                @uploadError = "uploadError" />
              <span class='field-label'>Female</span>
            </div>
          </div>
        </div>
        <button class='themed-button' type="submit">Add breed</button>
      </form>
    </section>
  </div>
</template>
  
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

import { BreedEntry, Gender } from '../app/types';
import { addBreed } from '../app/utils';

import GhostBreedUpload from "../components/GhostBreedUpload.vue";
import Information from '../components/ui/Information.vue';
type Availability = "b" | Gender;

const name = ref("");
// b for both
const genderAvailability = ref<Availability>("b");
const femaleBase64 = ref("");
const maleBase64 = ref("");
const status = reactive({
  level: 0,
  message: "",
  title: ""
});

// reset when availability changes
watch(genderAvailability, () => {
  femaleBase64.value = "";
  maleBase64.value = "";
});

function portraitSelected(gender: Gender, base64: string){
  if(gender === 'm')
    maleBase64.value = base64;
  else if (gender === 'f')
    femaleBase64.value = base64;
}

function uploadError(){
  Object.assign(status, {
    level: 3,
    title: "",
    message: `An error occurred adding the breed. Please check the
    limitations and try again.`
  });
}

function addToEntries(e: Event){
  // don't submit form
  e.preventDefault();

  // returns a set of specific properties depending
  // on the availability option selected
  const getGenderProps = (availability: Availability, male: string, female: string) => {
    if(availability === 'f')
      return { genderOnly: 'f', female };
    else if(availability === "m")
      return { genderOnly: 'm', male };
    
    // default to both
    return { genderOnly: false, female, male };
  };

  // create gender props
  const genderProps = getGenderProps(genderAvailability.value, maleBase64.value, femaleBase64.value);

  // there was an issue creating the props
  if(!genderProps) return;

  // add the breed
  const breed: BreedEntry = {
    name: name.value,
    //...{ genderOnly: 2, female: "", male: "" },
    ...getGenderProps(genderAvailability.value, maleBase64.value, femaleBase64.value),
    metaData: {
      group: "*",
      tags: ["Regular"],
      src: "ghost"
    }
  }

  if(addBreed(breed)){
    // successfully added
    Object.assign(status, {
      level: 1,
      title: "",
      message: "Breed successfully added: "+name.value
    });
  }
  else{
    Object.assign(status, {
      level: 3,
      title: "",
      message: `An error occurred adding the breed. Please check the
      limitations and try again.`
    });
  }
}
</script>

<style scoped>
.field-label{
  font-weight: bold;
}
#tile-upload{
  display: flex;
  flex-direction: row;
}
</style>
