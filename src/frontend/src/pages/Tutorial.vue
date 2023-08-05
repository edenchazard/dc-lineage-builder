<template>
  <div
    id="text"
    class="central-block"
  >
    <section>
      <h2>How to use</h2>
      <p>
        This lineage builder aims to allow you to create a lineage as it appears
        in the cave, right down to the fonts, spacing and colour. Use it for
        previewing new combinations and planning your code/lyrical lineages!
      </p>
      <ul class="list">
        <li>Add children or parents using the arrows next to each dragon.</li>
        <li>
          Names and codes are automatically generated, but you can single click
          the name/code to change it. Erasing a name or code will generate a new
          one.
        </li>
        <li>
          Click the dragon's image to change the breed. Breeds are automatically
          filtered. You can use the textbox to filter the breed name by your
          search. Results are ordered by breed names starting with the query and
          then those where the query appears anywhere else in the name.
        </li>
        <li>
          Hide the interface using the "hide/show interface" button. This will
          also display the lineage as it should appear in the cave.
        </li>
      </ul>
      <section>
        <h3>Buttons</h3>
        <ul class="buttons-list">
          <li><font-awesome-icon icon="arrow-right" /> Add parents.</li>
          <li><font-awesome-icon icon="arrow-left" /> Add a child.</li>
          <li>
            <font-awesome-icon icon="minus" /> Remove the parents (and any
            ancestors of those).
          </li>
          <li>
            <font-awesome-icon icon="mars" />/<font-awesome-icon icon="venus" />
            Swap the gender, which by default is always male. This button only
            appears on the leftmost node. If this breed is available in both
            genders, it will swap the gender directly and update the sprite. If
            this breed is only available in one gender, such as some event
            dragons, the breed will be reset to the placeholder.
          </li>
          <li>
            <font-awesome-icon icon="sync-alt" /> Switch the parent's genders.
            If one of the breeds is only available in one gender, the breed will
            be reset to the placeholder.
          </li>
          <li>
            <font-awesome-icon icon="clone" /> Clone the parent nodes and any
            further ancestors. This button can even be used to clone parts of
            unrelated lineages such as from a different tab.
          </li>
          <li>
            <font-awesome-icon icon="paste" /> Paste the most recently cloned
            item. If this node already has parents, it will replace them.
          </li>
          <li>
            <font-awesome-icon icon="cut" /> Remove all descendants and make
            this dragon the new root.
          </li>
          <li>
            <font-awesome-icon icon="font" /> Switch between the code or name.
          </li>
          <li>
            <font-awesome-icon icon="exclamation-triangle" /> This name or code
            does not pass dragcave's validation. Names and codes are not checked
            for availability.
          </li>
        </ul>
      </section>
      <section>
        <h3>Saving</h3>
        <p>Lineage Builder has two methods of saving.</p>
        <section>
          <h4>Online</h4>
          <p>
            You can save lineages online with Lineage Builder and share them
            with others but this does come with some limitations. These are:
          </p>
          <ul class="list">
            <li>
              Must be between {{ settings.gens.min }} and
              {{ settings.gens.max }} generations.
            </li>
            <li>Names and codes must fit DC's requirements.</li>
          </ul>
          <p>
            Please note that if a lineage hasn't been viewed in 2 months, it
            will be removed from the site. For this reason, it's recommended you
            view it before 2 months is up to reset the timer.
          </p>
        </section>
        <section>
          <h4>Export/Import</h4>
          <p>
            If your lineage is longer than {{ settings.gens.max }} generations,
            you can save the tree to a text file by using the export button and
            importing it that way.
          </p>
        </section>
      </section>
      <section>
        <h3>Changing the skin</h3>
        <p>
          Some users who use a different skin to DC's default may wish to view
          lineages using their chosen skin. Lineage Builder can simulate this as
          well, just change the skin in the dropdown in the header. This setting
          will persist even after you've closed the page.
        </p>
      </section>
      <section>
        <h3>Selection tools</h3>
        <p>
          To enter selection mode, hold a tile for 300 miliseconds and the
          selection menu will appear. Then, every tile you click will be added
          to the selection.
        </p>
        <p>
          To apply an action to the selected dragons, use the features on the
          right.
        </p>
        <p>
          You can unselect a dragon by clicking the tile again. Selection mode
          will end when no dragons are selected.
        </p>
        <p>
          You can select all dragons matching particular criteria using the
          features on the left.
        </p>
      </section>
    </section>
    <section id="notes">
      <h2>Notes</h2>
      <p>
        A note on rendering: Lineage Builder operates on a preference. As
        sprites require permission from their makers to host off-site, most
        dragons are rendered with style positioning and hotlinking to dragon
        images hosted on DC as a fallback. However, for sprites where permission
        has been granted to host off-site, Lineage Builder will use locally
        stored copies. These images are exactly as they appear on DC, whereas
        fallback images may appear slightly blurry.
      </p>
      <p>
        * Spriter alts are not included unless expressly approved by the artist.
      </p>
    </section>
    <section>
      <h2>Links</h2>
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
</template>

<script setup lang="ts">
import settings from '../app/settings';
</script>

<style scoped>
.buttons-list .svg-inline--fa {
  width: 20px;
}
</style>
