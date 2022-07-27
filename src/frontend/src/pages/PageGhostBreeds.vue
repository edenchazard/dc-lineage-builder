<template>
  <div class='central-block'>
    <Information :info="status" />
    <section>
      <p>On this page you can upload custom breeds, aka "ghost breeds", to Lineage Builder. This can be useful if you have breed you've created and want to see what it looks like in lineages. All you have to do is upload the lineage tile and fill in the settings.</p>
      <p>Ghost breeds will only be active for the <strong>duration of the session</strong>, as soon as you exit the page they will be automatically deleted! Ghost breeds are also <strong>not uploaded</strong> to the server, the whole process takes place client-side. That means it doesn't break DC's artist agreement for sharing unreleased breed information.</p>
      <p>
        Please ensure that names are unique and tiles are less than 8KB. DC lineage tiles are 48px height and 36px width.
      </p>
    </section>
    <section>
      <form @submit="addBreed">
        <div>
          <label for="name">Breed name: </label>
          <input type="text" id="name" name="name" v-model="name" />
        </div>
        <div>
          <span>Gender availability:</span>
          <input type="radio" v-model='genderAvailability' id="avail_both" value="both" />
          <label for="avail_both">Both</label>
          <input type="radio" v-model='genderAvailability' id="avail_male" value="male" />
          <label for="avail_male">Male-only</label>
          <input type="radio" v-model='genderAvailability' id="avail_female" value="female" />
          <label for="avail_female">Female-only</label>
        </div>
        <div>
          <span class='field-label'>Tile</span>
          <div v-if="genderAvailability == 'both'" id='tile-upload'>
            <div>
              <GhostBreedUpload
                @tileChosen = "(base64) => portraitSelected('male', base64)"
                @uploadError = "uploadError" />
              <span class='field-label'>Male</span>
            </div>
            <div>
              <GhostBreedUpload
                @tileChosen = "(base64) => portraitSelected('female', base64)"
                @uploadError = "uploadError" />
              <span class='field-label'>Female</span>
            </div>
          </div>
          <div v-if="genderAvailability == 'male'">
            <div>
              <GhostBreedUpload
                @tileChosen = "(base64) => portraitSelected('male', base64)"
                @uploadError = "uploadError" />
              <span class='field-label'>Male</span>
            </div>
          </div>
          <div v-if="genderAvailability == 'female'">
            <div>
              <GhostBreedUpload
                @tileChosen = "(base64) => portraitSelected('female', base64)"
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
  
<script>
import { addBreed } from '../app/utils';

import GhostBreedUpload from "../components/GhostBreedUpload.vue";
import Information from '../components/ui/Information';

export default {
  name: 'PageGhostBreeds',
  components: { Information, GhostBreedUpload },

  data() {
    return {
      name: "",
      genderAvailability: "both",
      femaleBase64: null,
      maleBase64: null,
      status: {
        level: 0,
        message: "",
        title: ""
      }
    }
  },

  watch:{
    // reset when availability changes
    'genderAvailability'(){
      this.femaleBase64 = null;
      this.maleBase64 = null;
    }
  },

  methods:{
    portraitSelected(gender, base64){
      if(gender == 'male')
        this.maleBase64 = base64;
      else if (gender == 'female')
        this.femaleBase64 = base64;
    },

    uploadError(){
        this.status = {
          level: 3,
          title: "",
          message: `An error occurred adding the breed. Please check the
          limitations and try again.`
        };
    },

    addBreed(e){
      // don't submit form
      e.preventDefault();

      // returns a set of specific properties depending
      // on the availability option selected
      const getGenderProps = (availability, male, female) => {      
        if(availability === "both")
          return { genderOnly: false, female, male };
        else if(availability === 'female')
          return { genderOnly: 'f', female };
        else if(availability === "male")
          return { genderOnly: 'm', male };
      };

      // add the breed
      const breed = {
        name: this.name,
        metaData: {
          group: "*",
          tags: [],
          src: "ghost"
        },
        ...getGenderProps(this.genderAvailability, this.maleBase64, this.femaleBase64)
      }

      if(addBreed(breed)){
        // successfully added
        this.status = { level: 1, message: "Breed successfully added: "+this.name };
      }
      else{
        this.status = {
          level: 3,
          title: "",
          message: `An error occurred adding the breed. Please check the
          limitations and try again.`
        };
      }
    }
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