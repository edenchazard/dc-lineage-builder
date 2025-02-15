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
      <section id="onsite-preview-form">
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
            type="textarea"
            v-model="input"
          />

          <button
            type="submit"
            class="pointer btn"
          >
            Check
          </button>
        </form>

        <FeedbackPanel ref="status" />
      </section>

      <section id="dragons">
        <h2>Preview</h2>
        <ul>
          <li
            v-for="code in codesToCheck"
            :key="code"
          >
            <span class="preview">
              <img
                class="dragon-cell"
                v-if="validateCode(code) && !badDragons.includes(code)"
                :src="`https://dragcave.net/image/${code}.png`"
                @error="badDragons.push(code)"
              />
              <font-awesome-icon
                v-else
                class="icon"
                icon="times"
              />
            </span>
            <span>({{ code }})</span>
          </li>
        </ul>
      </section>

      <section
        id="results"
        v-if="results.length > 0"
      >
        <h2>Results</h2>
        <ul class="checks">
          <li
            class="check"
            :id="`check-${result.code}`"
            v-for="result in results"
            :key="result.code"
          >
            <div class="dragon">
              <a
                :href="`https://dragcave.net/lineage/${result.code}`"
                target="_blank"
              >
                <img
                  class="dragon-cell"
                  :src="`https://dragcave.net/image/${result.code}.png`"
              /></a>
              <span class="code">({{ result.code }})</span>
            </div>

            <div class="result">
              <p v-if="result.problems.length === 0">
                <font-awesome-icon
                  class="icon"
                  icon="check"
                />
                No problems detected. Breeding these dragons will not produce
                inbred offspring.
              </p>

              <p
                v-if="
                  result.problems.filter((ancestor) => !ancestor.observable)
                    .length > 0
                "
              >
                <font-awesome-icon
                  class="icon"
                  icon="exclamation-triangle"
                />
                {{
                  result.problems.filter((ancestor) => !ancestor.observable)
                    .length
                }}
                dragons couldn't be checked. This is usually because the owner
                has blocked Lineage Builder.
              </p>

              <template
                v-if="
                  result.problems.filter((ancestor) => ancestor.observable)
                    .length > 0
                "
              >
                <p>
                  <font-awesome-icon
                    class="icon"
                    icon="times"
                  />
                  The following dragons would appear multiple times.
                </p>
                <ul class="conflicts">
                  <li
                    v-for="(ancestor, $index) in result.problems.filter(
                      (ancestor) => ancestor.observable,
                    )"
                    :key="ancestor.code ?? $index"
                  >
                    <a
                      :href="`https://dragcave.net/lineage/${ancestor.code}`"
                      target="_blank"
                    >
                      <img
                        class="dragon-cell"
                        :src="`https://dragcave.net/image/${ancestor.code}.png`"
                      />
                    </a>
                    <span>{{ ancestor.name }}</span>
                    <span class="code">({{ ancestor.code }})</span>
                    <span class="code"
                      >(<abbr
                        class="conflict"
                        title="conflicts with"
                        >c/w.
                      </abbr>
                      <span class="conflict-list">
                        <a
                          v-for="conflict in ancestor.conflicts"
                          :key="conflict"
                          :href="`#check-${conflict}`"
                          >{{ conflict }}</a
                        > </span
                      >)
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
import { ref, useTemplateRef, computed } from 'vue';
import { FetchError } from 'ofetch';
import { getInbred, type InbredCheckResponse } from '../app/api.js';
import FeedbackPanel from '../components/FeedbackPanel.vue';
import InputTextbox from '../components/InputTextbox.vue';
import { validateCode } from '../shared/validation.js';

const status = useTemplateRef('status');
const input = ref('FSz8O\nElkej\nhsM9q\nxjJ76\nqh2Z\nFsuG');
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

async function handleInbredCheck() {
  if (!status.value) return;

  try {
    const response = await getInbred(codesToCheck.value.filter(validateCode));

    // Deal with problems
    if (response.errors) {
      status.value.update(response.errors);
      if (response.errors.some((e) => e.type === 'error')) return;
    } else status.value.close();

    results.value = response.checks;
  } catch (ex) {
    if (ex instanceof FetchError && ex.response?.status === 404) {
      status.value.error((await ex.response.json()).errors[0].message);
      return;
    }

    status.value.error('Sorry, an error has occurred.');
  }
}
</script>

<style scoped lang="postcss">
#dragons ul {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 1rem 0;
}

#form {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  gap: 0.5rem;
}

#dragons li {
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

.dragon-cell {
  max-height: 3rem;
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
    gap: 0.5rem;
    width: 4rem;
    align-items: center;
  }

  & .dragon-cell {
    justify-self: center;
  }

  & .code {
    font-style: italic;
    grid-column: 1;
    justify-self: center;
  }

  & .result {
    align-self: center;
  }

  & .conflicts {
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

#dragons .preview {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

#form button[type='submit'] {
  width: 100%;
}

@media (min-width: 25rem) {
  .check {
    flex-direction: row;
    align-items: stretch;
  }
}
</style>
