<template>
<div>
    <section
        id='onsite-preview-form'
        class='central-block'>
        <div>
            <h2>Onsite Preview</h2>
            <p>On this page you can select two dragons and combine both of their lineages to see the result.</p>
            <p>Enter the codes for the male and the female. If you want lineage builder to check the genders are correct, you can do that by ticking the checkbox. Dragons without a gender, such as ungendered hatchlings, will be ignored.</p>
        </div>
        <form @submit="fetchLineage">
            <div>
                <label for="male">Male: </label>
                <input
                    type="text"
                    min="4"
                    max="5"
                    id="male"
                    v-model="maleCode" />
                <label for="female">Female: </label>
                <input
                    type="text"
                    min="4"
                    max="5"
                    id="female"
                    v-model="femaleCode" />
            </div>
            <div>
                <label for="doChecks">Check genders</label>
                <input
                    type="checkbox"
                    id="doChecks"
                    v-model="doChecks" />
            </div>
            <div>
                <button type="submit">Preview</button>
            </div>
        </form>
    </section>
    <section id="onsite-preview-result" v-if="htmlPreview !== ''">
        <OnSitePreview :htmlPreview="htmlPreview" />
    </section>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getOnSitePreview } from '../app/api';
import { validateCode } from '../app/validators';
import OnSitePreview from '../components/OnSitePreview.vue';

const htmlPreview = ref("");
const maleCode = ref("");
const femaleCode = ref("");
const doChecks = ref(true); 

async function fetchLineage(e: Event){
    e.preventDefault();
    const male = maleCode.value;
    const female = femaleCode.value;

    if(!validateCode(male) || !validateCode(female)){
        // error
        return;
    }

    const response = await getOnSitePreview(male, female, doChecks.value);

    if(response.data.status !== 1){
        // error
        return;
    }

    htmlPreview.value = response.data.html;
}
</script>

