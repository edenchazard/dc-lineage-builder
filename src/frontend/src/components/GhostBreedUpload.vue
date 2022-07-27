<template>
    <div class='breed-upload'>
        <div v-if="dragon.image !== null">
            <DragonPortrait
                class="tile-portrait disabled"
                :data="dragon" />
        </div>
        <input
            type='file'
            accept="image/png, image/gif"
            @change="imageChanged" />
    </div>
</template>
<script>
import DragonPortrait from "./DragonPortrait.vue";

export default {
    name: 'GhostBreedUpload',
    components: { DragonPortrait },
    props: { },

    data() {
        return {
            // We have to use a "dummy" dragon to display the portrait
            // unfortunately
            dragon: {
                image: null,
                metaData:{
                    src: "ghost"
                }
            }
        }
    },

    methods: {
        imageChanged(e){
            const input = e.target;

            if (input.files && input.files[0]) {
                const [file] = input.files;
                // ensure file is under 8kb
                if(file.size < 8000){
                    const reader = new FileReader();

                    reader.addEventListener("load", () => {
                        this.dragon.image = reader.result;
                        this.$emit("tileChosen", reader.result);
                    });

                    reader.readAsDataURL(file);
                }
                else {
                    this.$emit("uploadError");
                }
            }
        }
    }
};
</script>