<template>
  <v-layout v-if="!question" justify-center row>
    <h1 class="headline grey--text">404 - Not Found.</h1>
  </v-layout>
  <v-card color="grey lighten-3" v-else>
    <v-card-title primary-title>
      <v-layout row>
        <v-flex sm9>
          <h3 class="display-1 mb-0">{{ question.title }}</h3>
        </v-flex>
        <v-flex>
          <v-layout justify-end row>
            <p class="caption grey--text">
              {{ countTime }} ago created by {{ question.creator.name }}
            </p>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-layout row>
        <v-flex sm1>
          <v-layout justify-center row>
            <v-btn @click="up" flat icon :color="isUp ? 'orange' : ''">
              <v-icon>thumb_up</v-icon>
            </v-btn>
          </v-layout>
          <v-layout justify-center row>
            <h1 class="title">{{ totalVotes }}</h1>
          </v-layout>
          <v-layout justify-center row>
            <v-btn @click="down" flat icon :color="isDown ? 'orange' : ''">
              <v-icon>thumb_down</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex class="pa-2" sm11>
          <span v-html="question.description"></span>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from '@/api/server';
import { mapState } from 'vuex';

export default {
  name: 'questionCard',
  computed: {
    ...mapState([
      'user',
    ]),
    totalAnswers() {
      return this.answers.length;
    },
    totalVotes() {
      if (!this.question) {
        return 0;
      }
      return this.question.upvotes.length - this.question.downvotes.length;
    },
    diffTime() {
      return (new Date()) - (new Date(this.question.created));
    },
    countSec() {
      return Math.floor(this.diffTime / 1000);
    },
    countMin() {
      return Math.floor(this.countSec / 60);
    },
    countHr() {
      return Math.floor(this.countMin / 60);
    },
    countDay() {
      return Math.floor(this.countHr / 24);
    },
    countTime() {
      // eslint-disable-next-line
      return this.countSec < 60 ? `${this.countSec} sec(s)`
      // eslint-disable-next-line
          : this.countMin < 60 ? `${this.countMin} min(s)`
          // eslint-disable-next-line
          : this.countHr < 24 ? `${this.countHr} hr(s)`
          // eslint-disable-next-line
          : `${this.countDay} day(s)`;
    },
  },
  watch: {
    isUp() {
      if (this.isUp) {
        if (!this.question.upvotes.find(id => id === this.user.id)) {
          this.question.upvotes.push(this.user.id);
        }
      } else {
        this.question.upvotes = this.question.upvotes.filter(id => id !== this.user.id);
      }
      // this.updateVote();
      // console.log('dari isUp');
    },
    isDown() {
      if (this.isDown) {
        if (!this.question.downvotes.find(id => id === this.user.id)) {
          this.question.downvotes.push(this.user.id);
          this.updateVote();
        }
      } else {
        this.question.downvotes = this.question.downvotes.filter(id => id !== this.user.id);
        this.updateVote();
      }
      // console.log('dari isDown');
    },
    // eslint-disable-next-line
    'question._id'() {
      if (this.question) {
        this.checkVote();
      }
    },
  },
  mounted() {
    this.fetchQuestion();
    this.fetchAnswers();
    if (this.question) {
      this.checkVote();
    }
  },
  data() {
    return {
      answers: [],
      question: null,
      isUp: false,
      isDown: false,
    };
  },
  methods: {
    checkVote() {
      if (this.question.upvotes.find(id => id === this.user.id)) {
        this.isUp = true;
      }
      if (this.question.downvotes.find(id => id === this.user.id)) {
        this.isDown = true;
      }
    },
    up() {
      if (!this.isUp) {
        this.isUp = true;
        this.isDown = false;
      } else {
        this.isUp = false;
      }
    },
    down() {
      if (!this.isDown) {
        this.isDown = true;
        this.isUp = false;
      } else {
        this.isDown = false;
      }
    },
    updateVote() {
      const { id } = this.$route.params;
      const { token } = localStorage;
      axios
        // eslint-disable-next-line
        .patch(`/questions/${id}`, {
          upvotes: this.question.upvotes,
          downvotes: this.question.downvotes,
        }, {
          headers: { token },
        })
        .then(({ data }) => {
          const { updatedQuestion } = data;

          this.question = updatedQuestion;
        })
        .catch((err) => {
          const { message } = err.response.data;

          this.$store.dispatch('notify', {
            message, type: 'error',
          });
          this.isUp = false;
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
    fetchQuestion() {
      const { id } = this.$route.params;
      axios
        // eslint-disable-next-line
        .get(`/questions/${id}`)
        .then(({ data }) => {
          const { question } = data;

          this.question = question;
        })
        .catch((err) => {
          const { status } = err.response;

          if (status === 404) {
            this.question = null;
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
