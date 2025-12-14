<template>
  <div
    id="text"
    class="constrain-width content"
  >
    <div class="content-limit">
      <h1 id="tutorial">Tutorial</h1>
      <section>
        <h2>About</h2>
        <p>
          Lineage Builder is a tool creating lineages exactly as they would
          appear in the cave. Use it for previewing new combinations and
          planning your code/lyrical lineages!
        </p>
        <h2>How to use</h2>
        <h3>Using the builder</h3>
        <p>
          To change a dragon's breed picture, click their portrait to bring up
          the breed selector. You can use the textbox to search names or filter
          results by egg group and tag.
        </p>
        <h4 id="controls">Controls</h4>
        <p>
          Controls can be accessed via individual dragons or by
          <a href="#selection-tools">selecting</a> them and using the toolbar.
        </p>
        <div>
          <img
            class="float-right image"
            src="../assets/tutorial/controls.png"
          />
          <ul class="buttons-list">
            <li><FontAwesomeIcon icon="arrow-right" /> Add parents.</li>
            <li><FontAwesomeIcon icon="arrow-left" /> Add a child.</li>
            <li>
              <FontAwesomeIcon icon="minus" /> Remove the parents (and any
              ancestors of those).
            </li>
            <li>
              <FontAwesomeIcon icon="mars" />/<FontAwesomeIcon icon="venus" />
              Swap the gender, which by default is always male. This button only
              appears on the leftmost node. If this breed is available in both
              genders, it will swap the gender directly and update the sprite.
              If this breed is only available in one gender, such as some event
              dragons, the breed will be reset to the placeholder.
            </li>
            <li>
              <FontAwesomeIcon icon="sync-alt" /> Switch the parent's genders.
              If one of the breeds is only available in one gender, the breed
              will be reset to the placeholder.
            </li>
            <li>
              <FontAwesomeIcon icon="clone" /> Clone the parent nodes and any
              further ancestors. This button can even be used to clone parts of
              unrelated lineages such as from a different tab.
            </li>
            <li>
              <FontAwesomeIcon icon="paste" /> Paste the most recently cloned
              item. If this node already has parents, it will replace them.
            </li>
            <li>
              <FontAwesomeIcon icon="cut" /> Remove all descendants and make
              this dragon the new root.
            </li>
            <li>
              <FontAwesomeIcon icon="font" /> Switch between the code or name.
            </li>
          </ul>
        </div>
        <h4>Other icons</h4>
        <ul class="buttons-list">
          <li>
            <FontAwesomeIcon icon="exclamation-triangle" />
            <strong>Names and codes: </strong> The builder will validate names
            and codes for to confirm if they could be used on DC. However,
            they're not checked for availability.
          </li>
        </ul>
        <h4 id="selection-tools">Selection tools</h4>
        <p>Lineage builder supports applying actions to multiple dragons.</p>
        <img
          src="../assets/tutorial/toolbar.png"
          class="w-max image"
        />
        <p>
          To enter selection mode, hold a tile for 300 miliseconds to enable the
          selection tools. Then, every tile you click will be added to the
          selection. To unselect it, press the tile again.
        </p>
        <p>
          To apply an action to the selected dragons, use the toolbar. Most of
          the buttons are similar to the ones in the
          <a href="#controls">controls section</a>.
        </p>
        <p>
          You can select all dragons matching particular criteria using the
          buttons under the "Select" group.
        </p>
        <p>
          Selection mode will end when no dragons are selected. If you want to
          unselect everything, you can press the
          <FontAwesomeIcon
            icon="times"
            aria-label="Unselect all"
          />
          button.
        </p>
        <h3>Saving</h3>
        <p>Lineage Builder has two methods of saving.</p>
        <img
          class="float-right image"
          src="../assets/tutorial/save.png"
        />
        <h4>Online</h4>
        <p>
          You can save lineages online with Lineage Builder and share them with
          others but this does come with some limitations. These are:
        </p>
        <ul class="list">
          <li>
            Must be between {{ settings.gens.min }} and
            {{ settings.gens.max }} generations.
          </li>
          <li>Names and codes must fit DC's requirements.</li>
        </ul>
        <p>
          Please note that if a lineage hasn't been viewed in 2 months, it will
          be removed from the site. For this reason, it's recommended you view
          it before 2 months is up to reset the timer.
        </p>
        <h4>Offline (Export/Import)</h4>
        <p>
          If your lineage is longer than
          {{ settings.gens.max }} generations, you can save the tree to a text
          file by using the export button and importing it that way.
        </p>
        <h3>Changing the skin</h3>
        <img
          class="float-right image"
          src="../assets/tutorial/skin.png"
        />
        <p>
          Lineage Builder can emulate the skins on dragcave too, you can choose
          the skin using the dropdown in the footer. This setting will persist
          even after you've closed the page.
        </p>
      </section>
      <section>
        <h2 id="notes">Notes</h2>
        <p>
          A note on rendering: Lineage Builder operates on a preference. As
          sprites require permission from their makers to host off-site, most
          dragons are rendered with style positioning and hotlinking to dragon
          images hosted on DC as a fallback. However, for sprites where
          permission has been granted to host off-site, Lineage Builder will use
          locally stored copies. These images are exactly as they appear on DC,
          whereas fallback images may appear slightly blurry.
        </p>
        <p>
          * Spriter alts are not included unless expressly approved by the
          artist.
        </p>
      </section>
      <section>
        <h2 id="links">Links</h2>
        <ul class="list">
          <li>
            <a
              href="https://forums.dragcave.net/topic/189636-lineage-builder/"
              target="_blank"
              >Forum thread</a
            >
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import settings from '~/utils/shared/settings.js';
</script>

<style scoped>
.buttons-list .svg-inline--fa {
  width: 20px;
}

.float-right {
  float: right;
}

.image {
  margin: 0.5rem;
}
</style>
