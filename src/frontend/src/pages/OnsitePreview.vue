<template>
  <div class="constrain-width content">
    <div class="content-limit">
      <div>
        <Feedback ref="status" />
      </div>
      <section id="information">
        <div>
          <h1>Onsite Preview</h1>
          <p>
            This utility allows you to select two dragons and combine both of
            their lineages to see the result.
          </p>
          <p>
            Start by entering the codes for the male and the female and press
            preview. You can have Lineage Builder automatically check the
            genders are correct by ticking the checkbox. Dragons without a
            gender, such as ungendered hatchlings, will be ignored.
          </p>
          <p><strong>This feature is experimental.</strong></p>
        </div>
      </section>
      <section id="onsite-preview-form">
        <form @submit="fetchLineage">
          <div>
            <label for="male">Male: </label>
            <input
              id="male"
              v-model="maleCode"
              type="text"
              min="4"
              max="5"
            />
            <label for="female">Female: </label>
            <input
              id="female"
              v-model="femaleCode"
              type="text"
              min="4"
              max="5"
            />
          </div>
          <div>
            <input
              id="doChecks"
              v-model="doChecks"
              type="checkbox"
            />
            <label for="doChecks">Check genders</label>
          </div>
          <div>
            <button type="submit">Preview</button>
          </div>
        </form>
      </section>
    </div>
  </div>

  <section id="onsite-preview-result">
    <div
      v-if="htmlPreview !== ''"
      :id="containerID"
    >
      <LineageGenerationCounter
        :count="generations"
        :limit="cutoff"
      />
      <OnSitePreview :html-preview="htmlPreview" />
    </div>
  </section>
</template>

<script setup lang="ts">
/*
<div>
    <input
        type="checkbox"
        id="doRightmostFix"
        v-model="fixRightmostColumn" />
    <label for="doRightmostFix">Fix rightmost column on 13+ lineages</label>
</div> */
import { ref, nextTick } from 'vue';
import { getOnSitePreview } from '../app/api';
import { validateCode } from '../app/validators';
import OnSitePreview from '../components/OnsitePreview.vue';
import LineageGenerationCounter from '../components/Lineage/LineageGenerationCounter.vue';
import Feedback from '../components/UI/Feedback.vue';

const containerID = 'onsite-preview-container';
const htmlPreview = ref('');
const maleCode = ref('');
const femaleCode = ref('');
const doChecks = ref(true);
const generations = ref(0);
const cutoff = 12;
const fixRightmostColumn = ref(true);
const status = ref<InstanceType<typeof Feedback>>();

// specify how many columns down we need to go and then return the li nodes
function getColumnsNDeep<T extends HTMLElement>(
  depth: number,
  additionalSelectors: string = '',
) {
  depth += 1;
  const deepNodes = ' > ul > li'.repeat(depth);
  const selector = `#${containerID} ${deepNodes} ${additionalSelectors}`;
  return Array.from<T>(document.querySelectorAll(selector));
}

function getTilesNDeep(depth: number) {
  return getColumnsNDeep<HTMLImageElement>(depth, '> div > a > img');
}

function getColumn(depth: number) {
  return getColumnsNDeep<HTMLLIElement>(depth);
}

async function fetchLineage(e: Event) {
  e.preventDefault();
  if (!status.value) return;

  // reset
  status.value.close();

  const mCode = maleCode.value;
  const fCode = femaleCode.value;

  if (!validateCode(mCode) || !validateCode(fCode)) {
    status.value.warn(
      'Invalid code. Codes must be 4-5 characters in length and alphanumeric.',
    );
    // error
    return;
  }

  status.value.info({ message: 'Contacting server...', showDismiss: false });
  const response = await getOnSitePreview(mCode, fCode, doChecks.value);

  // Deal with problems
  if (response.data.errors.length > 0) {
    status.value.update(response.data.errors);
    if (response.data.errors.some((e) => e.type === 'Error')) return;
  } else status.value.close();

  const { male, female } = response.data.data.dragons;

  // build the lineage html
  htmlPreview.value = male.html + female.html;

  // Choose the highest gen from our pair and plus one (for the result)
  generations.value = Math.max(male.gen, female.gen) + 1;

  // Clean up lineage
  nextTick(() => {
    // fix 5th column tile sizes, if we have to
    getTilesNDeep(5).forEach((el) => (el.style.width = '24px'));

    // remove everything after the cut off column, which appears
    // when both lineages are combined into one
    if (fixRightmostColumn.value) {
      getColumn(cutoff + 1).forEach((el) => {
        const ul = el.parentNode as HTMLUListElement;
        ul?.parentNode?.removeChild(ul);
      });
    }
  });
}
</script>

<style scoped>
#onsite-preview-container {
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}
</style>
