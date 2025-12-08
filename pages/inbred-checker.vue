<template>
  <div class="constrain-width content">
    <div class="content-limit">
      <section id="information">
        <div>
          <h1>Inbred Checker</h1>
          <p>
            This utility lets you compare the ancestry of multiple dragons to
            see whether the results would be inbred.
          </p>
          <p>
            The inbred checker will only look at the first 12 generations for
            each dragon, so ancestry beyond that will not be assessed.
          </p>
          <p>
            Put each code on a new line. Dragons with a
            <font-awesome-icon
              class="icon"
              icon="times"
            />
            above their code are invalid.
          </p>
        </div>
      </section>

      <section id="dragons-to-check-form">
        <form
          id="form"
          class="form"
          @submit.prevent="handleInbredCheck()"
        >
          <label
            for="input"
            class="label"
            >Dragons to check</label
          >
          <InputTextbox
            id="input"
            v-model="input"
            type="textarea"
            autocomplete="off"
            spellcheck="false"
            rows="10"
          />

          <button
            type="submit"
            class="pointer btn"
            :disabled="codesToCheck.filter(validateCode).length === 0"
          >
            Check
          </button>
        </form>

        <FeedbackPanel ref="status" />
      </section>

      <section id="preview">
        <h2>Preview</h2>
        <ul>
          <li
            v-for="code in codesToCheck"
            :key="code"
          >
            <span class="preview">
              <a
                v-if="validateCode(code) && !badDragons.includes(code)"
                :href="`https://dragcave.net/lineage/${code}`"
                target="_blank"
                class="portrait"
              >
                <img
                  class="picture"
                  :src="`https://dragcave.net/image/${code}/1.png`"
                  @error="badDragons.push(code)"
                />
              </a>
              <font-awesome-icon
                v-else
                class="icon"
                icon="times"
              />
            </span>
            <span>
              <button
                type="button"
                class="code-jump"
                @click="scrollTo(code)"
              >
                ({{ code }})
              </button>
            </span>
          </li>
        </ul>
      </section>

      <section
        v-if="results.length > 0"
        id="results"
      >
        <h2>Results</h2>
        <ul class="checks">
          <li
            v-for="result in results"
            :id="`dragon-${result.code}`"
            :key="result.code"
            class="check"
          >
            <div class="dragon">
              <a
                :href="`https://dragcave.net/lineage/${result.code}`"
                target="_blank"
                class="portrait"
              >
                <img
                  class="picture"
                  :src="`https://dragcave.net/image/${result.code}/1.png`"
                />
              </a>
              <span>{{ result.name }}</span>
              <span class="code">({{ result.code }})</span>
            </div>

            <div class="result">
              <p
                v-if="result.failed > 0"
                class="warn"
              >
                <font-awesome-icon
                  class="icon"
                  icon="exclamation-triangle"
                />
                {{ result.failed }}
                dragons couldn't be checked. This is usually because the owner
                has blocked Lineage Builder. Checks will be unreliable and a
                manual check should be performed.
              </p>

              <p
                v-if="
                  result.problems.length === 0 &&
                  result.selfProblems.length === 0
                "
              >
                <font-awesome-icon
                  class="icon"
                  icon="check"
                />
                No problems detected. It isn't inbred, and breeding this dragon
                to any of the other dragons on your list will not produce inbred
                offspring.
              </p>

              <template v-if="result.selfProblems.length > 0">
                <p>
                  <font-awesome-icon
                    class="icon"
                    icon="times"
                  />
                  The following dragons directly appear in the dragon's own
                  lineage multiple times.
                </p>
                <ul class="conflicts">
                  <li
                    v-for="ancestor in result.selfProblems"
                    :key="ancestor.code"
                  >
                    <a
                      :href="`https://dragcave.net/lineage/${ancestor.code}`"
                      target="_blank"
                      class="portrait"
                    >
                      <img
                        class="picture"
                        :src="`https://dragcave.net/image/${ancestor.code}/1.png`"
                      />
                    </a>
                    <span>{{ ancestor.name }}</span>
                    <span class="code">({{ ancestor.code }})</span>
                  </li>
                </ul>
              </template>

              <template v-if="result.problems.length > 0">
                <p>
                  <font-awesome-icon
                    class="icon"
                    icon="times"
                  />
                  When bred with certain dragons on your list, the following
                  dragons would appear multiple times.
                </p>
                <ul class="conflicts">
                  <li
                    v-for="ancestor in result.problems"
                    :key="ancestor.code"
                  >
                    <a
                      :href="`https://dragcave.net/lineage/${ancestor.code}`"
                      target="_blank"
                      class="portrait"
                    >
                      <img
                        class="picture"
                        :src="`https://dragcave.net/image/${ancestor.code}/1.png`"
                      />
                    </a>
                    <span>{{ ancestor.name }}</span>
                    <span class="code">({{ ancestor.code }})</span>
                    <span class="code"
                      ><abbr
                        class="conflict"
                        title="conflicts with"
                        >c/w.
                      </abbr>
                      <span class="conflict-list">
                        <button
                          v-for="conflict in ancestor.conflicts"
                          :key="`${ancestor.code}-${conflict}`"
                          type="button"
                          class="code-jump"
                          @click="scrollTo(conflict)"
                        >
                          ({{ conflict }})
                        </button></span
                      >
                    </span>
                  </li>
                </ul>
              </template>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, computed, watch } from 'vue';
import { FetchError } from 'ofetch';
import { getInbred, type InbredCheckResponse } from '~/composables/useAPI';
import FeedbackPanel from '~/components/FeedbackPanel.vue';
import InputTextbox from '~/components/InputTextbox.vue';
import { validateCode } from '~/utils/shared/validation.js';

const status = useTemplateRef('status');
const input = ref('');
const badDragons = ref<string[]>([]);
const results = ref<InbredCheckResponse['checks']>([]);

const codesToCheck = computed(() => {
  try {
    return input.value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => !!line);
  } catch {
    return [];
  }
});

watch(codesToCheck, () => {
  badDragons.value = [];
});

async function handleInbredCheck() {
  if (!status.value) return;

  try {
    const response = await getInbred(codesToCheck.value.filter(validateCode));

    // Deal with problems
    if (response.errors) {
      status.value.update(response.errors);
      if (response.errors.some((e) => e.type === 'error')) return;
    } else status.value.close();

    results.value = response.checks
      .sort(
        (a, b) =>
          a.problems.length +
          a.selfProblems.length -
          (b.problems.length + b.selfProblems.length),
      )
      .reverse();
  } catch (ex) {
    if (ex instanceof FetchError && ex.response?.status === 404) {
      status.value.error((await ex.response.json()).errors[0].message);
      return;
    }

    status.value.error('Sorry, an error has occurred.');
  }
}

function scrollTo(id: string) {
  const element = document.getElementById(`dragon-${id}`);
  if (element) element.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style scoped>
#dragons-to-check-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

#form {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  gap: 0.5rem;

  & button[type='submit'] {
    width: 100%;

    &:disabled {
      opacity: 0.5;
    }
  }
}

#preview {
  & ul {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin: 1rem 0;
  }

  & li {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-direction: column;
    font-style: italic;
    width: 4rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  & .preview {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.portrait {
  width: 3rem;
  height: 4rem;
  border: 1px solid var(--dc-lineage-line-colour);
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  & .picture {
    max-height: 100%;
    max-width: 100%;
  }
}

.code-jump {
  font-style: italic;
  text-decoration: underline;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  margin: 0;
  padding: 0;
}

.check {
  border-top: 1px solid var(--dc-lineage-line-colour);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;

  &:first-child {
    border-top: none;
  }

  & .dragon {
    display: flex;
    flex-direction: column;
    width: 6rem;
    text-align: center;
    align-items: center;
  }

  & .code {
    font-style: italic;
    grid-column: 1;
    justify-self: center;
  }

  & .result {
    align-self: center;
    flex: 1;
  }

  & .warn {
    font-weight: bold;
  }

  & .conflicts {
    margin-top: 0.5rem;
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));

    & li {
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;
      font-size: 0.9rem;

      & .conflict {
        font-weight: bold;
        font-style: normal;
      }
    }

    & .conflict-list {
      display: inline-flex;
      gap: 0.25rem;
    }
  }
}

@media (min-width: 25rem) {
  .check {
    flex-direction: row;
    align-items: stretch;
  }
}
</style>
