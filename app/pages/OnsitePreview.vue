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
            Enter the codes for the male and the female and press preview.
            Lineage Builder will check the genders of both dragons, although
            dragons without a gender, such as ungendered hatchlings, will be
            ignored.
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
            <button type="submit">Preview</button>
          </div>
        </form>
      </section>
    </div>
  </div>

  <LineageWrapper
    v-if="htmlPreview !== ''"
    :id="containerID"
    :generations="generations"
    :generation-cut-off="cutoff"
  >
    <OnsitePreview :html-preview="htmlPreview" />
  </LineageWrapper>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { getOnSitePreview } from '../app/api.js';
import OnsitePreview from '../components/OnsitePreview.vue';
import Feedback from '../components/Feedback.vue';
import { validateCode } from '../shared/validation.js';
import { AxiosError } from 'axios';
import LineageWrapper from '../components/LineageWrapper.vue';

const containerID = 'onsite-preview-container';
const htmlPreview = ref('');
const maleCode = ref('');
const femaleCode = ref('');
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
    return;
  }

  try {
    status.value.info({ message: 'Contacting server...', showDismiss: false });

    const response = await getOnSitePreview(mCode, fCode, {
      dpr: window.devicePixelRatio ?? 1,
    });

    // Deal with problems
    if (response.data.errors) {
      status.value.update(response.data.errors);
      if (response.data.errors.some((e) => e.type === 'error')) return;
    } else status.value.close();

    const { male, female } = response.data;

    // build the lineage html
    htmlPreview.value = male.html + female.html;

    // Choose the highest gen from our pair and plus one (for the result)
    generations.value = Math.max(male.gen, female.gen) + 1;

    // Clean up lineage
    await nextTick();

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
  } catch (ex) {
    if (ex instanceof AxiosError && ex.response?.status === 404) {
      status.value.error(ex.response.data.errors[0].message);
      return;
    }

    status.value.error('Sorry, an error has occurred.');
  }
}
</script>

<style scoped>
#onsite-preview-container {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  flex: 1;
}
</style>
