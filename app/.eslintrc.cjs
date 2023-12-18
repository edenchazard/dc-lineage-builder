module.exports = {
  env: {
    browser: true,
  },
  extends: ['plugin:vue/vue3-recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    // todo look at this later
    'vue/multi-word-component-names': 0,
  },
};
