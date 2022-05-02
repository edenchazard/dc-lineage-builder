<template>
    <div
        class='focusable-dialog'
        role="dialog"
        aria-modal="true">
        <div id='modal-header'>
            <slot name='title'>
                Dialog Title
            </slot>
            <slot name='close'>
                <button
                    class='close themed-button'
                    @click="close">close</button>
            </slot>
        </div>
        <div id='modal-description'>
            <slot name='content'></slot>
        </div>
    </div>
</template>
<script>
// I know this is hacky but this is the easiest and most optimal solution
// I could think of
//import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default {
    name: 'FocusableDialog',

    data() {
        return {}
    },

    mounted(){
        const $this = this;
        const properties = {
            outsideEvent(e){
                //console.log('b', this.$el)
                //console.log('t', e.target)
                if ($this.$el.parentNode && !$this.$el.parentNode.contains(e.target)) {
                    $this.close();
                }
            },
            touchstart(e){
                e.preventDefault();
                e.stopPropagation();
            },
            touchmove(e){
                e.preventDefault();
                e.stopPropagation();
            }
        };

        this.$el.dialogProperties = properties;

        //document.addEventListener('touchstart', properties.touchstart, { passive: false });
        //document.addEventListener('touchmove', properties.touchmove, { passive: false });
        document.addEventListener('click', properties.outsideEvent);
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

    },

    // clean up
    beforeDestroy(){
        this.cleanUp();
    },

    methods: {
        cleanUp(){
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";

            //enableBodyScroll(this.$el);
            console.log(this.$el)
            //clearAllBodyScrollLocks();
            document.removeEventListener('click', this.$el.dialogProperties.outsideEvent);
            //document.addEventListener('touchstart', this.$el.dialogProperties.touchstart);
            //document.addEventListener('touchmove', this.$el.dialogProperties.touchmove);
        },

        selected(breed){
            this.close();
            this.$emit('selected', breed);
        },
        close(){
            this.cleanUp();
            this.$emit('close');
        }
    }
};
</script>
<style scoped>
.focusable-dialog{
    background: #fff;
    z-index: 99;
    position: fixed;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100%;
    margin:0px;
    max-height: 500px;
    display: flex;
    flex-direction: column;
    padding: 4px;
    overscroll-behavior: contain;
}
#modal-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
}
#modal-description{
    flex: 1;
    display: flex;
    overflow: auto;
    flex-direction: column;
}
@media only screen and (min-width: 501px){
    .focusable-dialog{
        width:500px;
        -webkit-box-shadow:0px 0px 200px 0px #000000; 
        box-shadow: 0px 0px 200px 0px #000000;
        margin-left: -250px;
        left: 50%;
    }
}
@media only screen and (min-height: 501px){
    .focusable-dialog{
        height:500px;
        /* https://stackoverflow.com/questions/2005954/center-a-positionfixed-element */
        margin-top: -250px;
        top: 50%;
        -webkit-box-shadow:0px 0px 200px 0px #000000; 
        box-shadow: 0px 0px 200px 0px #000000;
    }
}
</style>