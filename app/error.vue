<template>
  <div class="central-block">
    <h2>
      {{
        error.statusCode === 404
          ? '404 No dragons here!'
          : 'Something went wrong'
      }}
    </h2>
    <p>
      {{
        error.statusCode === 404
          ? 'The page could not be found.'
          : 'Sorry, an error has occurred :('
      }}
    </p>
    <NuxtLink to="/">Return to the builder</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number;
    statusMessage?: string;
  };
}>();

useSeoMeta({
  title: 'Error',
});
</script>
