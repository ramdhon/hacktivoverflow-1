<template>
  <v-container class="pt-5">
    <v-layout row>
      <v-flex class="pa-4" sm9>
        <QuestionCard @listen="listenQuestion"/>
        <v-flex v-if="question">
          <AnswerForm @upload="upload"/>
          <h1 class="display-1">{{ totalAnswers }} answer{{ totalAnswers > 1 ? 's' : '' }}</h1>
          <v-divider></v-divider>
          <AnswerCard
            v-for="(answer, index) in answers"
            :key="index"
            :answer="answer"
          />
        </v-flex>
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
import AnswerCard from '@/components/AnswerCard.vue';
import AnswerForm from '@/components/AnswerForm.vue';
import axios from '@/api/server';
import { mapState } from 'vuex';

export default {
  name: 'question',
  components: {
    WatchedTags,
    QuestionCard,
    AnswerCard,
    AnswerForm,
  },
  computed: {
    ...mapState([
      'isLogin',
    ]),
    totalAnswers() {
      if (!this.answers) {
        return 0;
      }
      return this.answers.length;
    },
  },
  mounted() {
    this.fetchAnswers();
  },
  data() {
    return {
      question: null,
      answers: [],
    };
  },
  methods: {
    listenQuestion(question) {
      this.question = question;
    },
    upload(formData) {
      const { token } = localStorage;

      this.$store.commit('loading', true);
      axios
        .post('/answers', formData, { headers: { token } })
        .then(({ data }) => {
          this.$store.commit('loading', false);
          const { message, newAnswer } = data;

          this.$store.dispatch('notify', {
            message, type: 'success',
          });
          this.answers.unshift(newAnswer);
        })
        .catch((err) => {
          this.$store.commit('loading', false);
          const { message } = err.response.data;

          this.$store.dispatch('notify', {
            message, type: 'error',
          });
        });
    },
    fetchAnswers() {
      const { id } = this.$route.params;

      axios
        // eslint-disable-next-line
        .get(`/questions/${id}/answers`)
        .then(({ data }) => {
          const { answers } = data;

          this.answers = answers;
        })
        .catch((err) => {
          const { status } = err.response;

          if (status === 404) {
            this.answers = [];
          } else {
            const { message } = err.response.data;

            this.$store.dispatch('notify', {
              message, type: 'error',
            });
          }
        });
    },
  },
};
</script>
