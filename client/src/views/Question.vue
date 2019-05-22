<template>
  <v-container class="pt-5">
    <v-layout row>
      <v-flex class="pa-4" sm9>
        <QuestionCard/>
      </v-flex>
      <v-flex class="pa-4" sm3>
        <WatchedTags v-show="isLogin"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import WatchedTags from '@/components/WatchedTags.vue';
import QuestionCard from '@/components/QuestionCard.vue';
import { mapState } from 'vuex';

export default {
  name: 'question',
  components: {
    WatchedTags,
    QuestionCard,
  },
  computed: {
    ...mapState([
      'isLogin',
    ]),
  },
  created() {
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
