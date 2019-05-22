<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="title mb-0"><v-icon>remove_red_eye</v-icon>&ensp;Watched Tags</h3>
    </v-card-title>

    <v-card-text>
      <v-chip v-for="(tag, index) in tags" :key="index">{{ tag }}</v-chip>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'watchedTags',
  data() {
    return {
      tags: ['lorem', 'ipsum', 'dolon', 'ist', 'magna', 'aliqua', 'enim', 'minim'],
    };
  },
};
</script>
