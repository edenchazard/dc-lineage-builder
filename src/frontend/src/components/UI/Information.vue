<template>
  <div
    class="container central-block"
    :class="getClass"
  >
    <p>{{ info.message }}</p>
  </div>
</template>
<script>
export default {
  name: 'Information',
  components: {},
  props: {
    info: Object,
  },
  computed: {
    getClass() {
      const classes = ['hidden', 'information', 'success', 'error'];
      return classes[this.info.level];
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.container {
  padding: 5px;
  font-weight: bold;
}
.hidden {
  display: none;
}
.information {
  background: #78b7f7;
  color: #fff;
}
.error {
  background: #cd5c5c;
  color: #fff;
}
.success {
  background: #40791a;
  color: #fff;
}
</style>
