<template>
<Transition>
    <div
        v-if="!hidden" 
        class="container"
        :class="className">
        <div class="split">
            <div class="icon-portion">
                <font-awesome-icon class="icon" :icon="Feedbacks[state.type]" />
            </div>
            <div class="message-portion">
                {{ state.message }}
            </div>
            <div
                v-if="state.showDismiss"
                class="close-portion">
                <button
                    type="button"
                    class="close-button"
                    title="Dismiss"
                    @click="close">
                    <font-awesome-icon icon="times" />
                </button>
            </div>
        </div>
    </div>
</Transition>
</template>
<script setup lang="ts">
import { onBeforeUnmount, PropType, reactive, ref, computed } from 'vue';

const Feedbacks = {
    "None": 'none',
    "Warning": 'exclamation-triangle',
    "Success": 'check',
    "Information": 'info-circle',
    "Error": 'times'
}; 

type FeedbackTypes = keyof typeof Feedbacks;

interface Properties {
    message: string,
    type: FeedbackTypes,
    autoClose: number,
    showDismiss: boolean
}

type Feedback = Partial<Properties>;

const props = defineProps({
    globalSettings: {
        type: Object as PropType<Feedback>,
        required: false
    }
});

const defaults: Readonly<Properties> = {
    message: "",
    type: "None",
    autoClose: -1,
    showDismiss: true
};

const initialState = { ...defaults, ...props.globalSettings };
const state = reactive<Properties>({ ...initialState });
const hidden = ref(true);
const className = computed(() => state.type in Feedbacks ? state.type : "None");
let timeoutId: ReturnType<typeof setTimeout>;

onBeforeUnmount(cleanUp);

function convertToFeedbackProps(feedback: Feedback | string){
    return typeof feedback === "string" ? { message: feedback } : feedback;
}

function update(feedback: Feedback | string){
    feedback = convertToFeedbackProps(feedback);

    const combinedProps = {
        ...defaults,
        ...props.globalSettings, // override with global
        ...feedback // override and apply the settings from this instance
    };

    if(!(combinedProps.type in Feedbacks))
        throw new Error("Invalid feedback type: " + combinedProps.type);

    hidden.value = false;
    mergeState(combinedProps);

    // clear previous if active
    cleanUp();

    if(combinedProps.autoClose > -1)
        timeoutId = setTimeout(close, combinedProps.autoClose);
}

function close(){
    hidden.value = true;
    mergeState({ ...initialState });
}

function mergeState(newState: Feedback){
    Object.assign(state, newState);
}

function cleanUp(){
    clearTimeout(timeoutId);
}

const createShortcut = (forType: FeedbackTypes) => {
    return function(feedback: Feedback | string){
        feedback = convertToFeedbackProps(feedback);
        update({ ...feedback, type: forType });
    }
}

const warn = createShortcut('Warning');
const info = createShortcut('Information');
const error = createShortcut("Error");
const success = createShortcut('Success');

defineExpose({
    update,
    warn,
    info,
    error,
    success,
    close
});
</script>
<style scoped>
.container{
    padding:5px 20px;
    font-weight: bold;
}
.None{
    display: none;
}
.Information{
    background: #93c5fd;
    color:#000;
}
.Error{
    background: #fca5a5;
    color:#000;
}
.Success{
    background: #bef264;
    color:#000;
}
.Warning{
    background: #fde047;
    color:#000;
}
.split{
    display: flex;
    align-items: center;
}
.icon-portion{
    margin: 0px 10px;
    text-align: center;
}
.icon-portion .icon {
    width:40px;
    height:40px;
}
.message-portion{
    flex: 1;
}
.close-portion .close-button{
    background-color: inherit;
    border: 0px none;
}
.close-portion .close-button:hover{
    cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>