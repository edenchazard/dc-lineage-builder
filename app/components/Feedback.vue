<!-- eslint-disable vue/no-v-html -->
<template>
  <TransitionGroup
    tag="ul"
    class="list"
    @after-leave="closed"
  >
    <li
      v-for="(feedback, index) in stack"
      :key="index"
      class="item"
      :class="getFeedbackClass(feedback.type)"
    >
      <span class="symbol">
        <font-awesome-icon
          class="icon"
          :icon="Feedbacks[feedback.type]"
        />
      </span>
      <p v-html="feedback.message"></p>
      <button
        v-if="feedback.showDismiss"
        type="button"
        class="dismiss pointer"
        title="Dismiss"
        @click="dismiss(index)"
      >
        <font-awesome-icon icon="times" />
      </button>
    </li>
  </TransitionGroup>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import type { PropType } from 'vue';

const Feedbacks = {
  none: 'none',
  warning: 'exclamation-triangle',
  success: 'check',
  information: 'info-circle',
  error: 'times',
};

type FeedbackTypes = keyof typeof Feedbacks;

interface Properties {
  message: string;
  type: FeedbackTypes;
  autoClose: number;
  showDismiss: boolean;
}

type Feedback = Partial<Properties>;

const props = defineProps({
  globalSettings: {
    type: Object as PropType<Feedback>,
    required: false,
    default: () => {},
  },
});

defineEmits<{
  (e: 'closed'): void;
}>();

let onCloseHandler: () => void;

const defaults: Readonly<Properties> = {
  message: '',
  type: 'none',
  autoClose: -1,
  showDismiss: true,
};

//const initialState = { ...defaults, ...props.globalSettings };
const stack = ref<Properties[]>([]);
const hidden = ref(true);
const autoCloseTimeouts = ref<Array<ReturnType<typeof setTimeout>>>([]);

onBeforeUnmount(cleanUp);

function getFeedbackClass(type: string) {
  return type in Feedbacks ? type : 'None';
}

function convertToFeedbackProps(feedback: Feedback | string) {
  return typeof feedback === 'string' ? { message: feedback } : feedback;
}

function update(feedback: Feedback[] | Feedback | string) {
  // clear previous if active
  cleanUp();

  let messages: Array<Feedback | string> = [];

  if (!Array.isArray(feedback)) messages = [feedback];
  else messages = feedback;

  stack.value = messages.map((fd, index) => {
    const combinedProps = {
      ...defaults,
      ...props.globalSettings, // override with global
      ...convertToFeedbackProps(fd), // override and apply the settings from this instance
    };

    if (!(combinedProps.type in Feedbacks))
      throw new Error('Invalid feedback type: ' + combinedProps.type);

    if (combinedProps.autoClose > -1)
      autoCloseTimeouts.value.push(
        setTimeout(() => dismiss(index), combinedProps.autoClose),
      );

    return combinedProps;
  });

  hidden.value = false;
}

function dismiss(index: number) {
  stack.value.splice(index, 1);

  if (stack.value.length === 0) close();
}

function closed() {
  onCloseHandler && onCloseHandler();
}

// [TODO] I don't like that this doesn't work as a promise but I
// don't have time to sort it.
function close(whenClosed?: () => void) {
  hidden.value = true;
  stack.value = [];
  if (whenClosed) {
    onCloseHandler = whenClosed;
  }
}

function cleanUp() {
  // clear all timeouts and empty array
  autoCloseTimeouts.value.forEach((id) => clearTimeout(id));
  autoCloseTimeouts.value = [];
}

const createShortcut = (forType: FeedbackTypes) => {
  return function (feedback: Feedback | string) {
    update({ ...convertToFeedbackProps(feedback), type: forType });
  };
};

const warn = createShortcut('warning');
const info = createShortcut('information');
const error = createShortcut('error');
const success = createShortcut('success');

defineExpose({
  update,
  warn,
  info,
  error,
  success,
  close,
});
</script>
<style scoped>
.list {
  padding: 0;
}
.item {
  display: grid;
  grid-template-columns: auto auto 2rem;
  align-items: center;
  gap: 1rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
}
.right {
  display: flex;
}
.none {
  display: none;
}
.information {
  background: #93c5fd;
  color: #000;
}
.error {
  background: #fca5a5;
  color: #000;
}
.success {
  background: #bef264;
  color: #000;
}
.warning {
  background: #fde047;
  color: #000;
}
.symbol {
  display: flex;
  justify-content: center;
  border-radius: 100%;
  height: 2rem;
  aspect-ratio: 1/1;
  align-items: center;
  border: 1px solid;
  padding: 0.5rem;
}
.icon {
  width: 100%;
  height: 100%;
}
.dismiss {
  background-color: transparent;
  border: none;
  display: flex;
  align-self: stretch;
  font-size: 1.2rem;
  padding: 0;
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
