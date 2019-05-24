<template>
  <v-layout v-if="!question && !loading" justify-center row>
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
            <v-btn @click="up" flat icon :color="isUp&&isLogin ? 'orange' : ''">
              <v-icon>thumb_up</v-icon>
            </v-btn>
          </v-layout>
          <v-layout justify-center row>
            <h1 class="title">{{ totalVotes }}</h1>
          </v-layout>
          <v-layout justify-center row>
            <v-btn @click="down" flat icon :color="isDown&&isLogin ? 'orange' : ''">
              <v-icon>thumb_down</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex class="pa-2" sm11>
          <span v-html="question.description"></span>
          <v-layout row wrap>
            <v-flex>
              <v-chip small label color="orange" text-color="white">
                <v-icon left>label</v-icon>Tags
              </v-chip>
              <v-chip small
                @click="findTag(tag.title)"
                v-for="(tag, index) in question.tags"
                :key="index"
              >
                {{ tag.title }}
              </v-chip>
            </v-flex>
            <v-flex v-if="question.creator._id === user.id" sm2>
              <v-btn flat icon>
                <v-icon>create</v-icon>
              </v-btn>
              <v-btn @click="removeQuestion" flat icon color="red">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
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
      'isLogin',
      'loading',
    ]),
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
      if (this.isUp && this.user) {
        if (!this.question.upvotes.find(id => id === this.user.id)) {
          this.question.upvotes.push(this.user.id);
        }
      } else {
        this.question.upvotes = this.question.upvotes.filter(id => id !== this.user.id);
      }
    },
    isDown() {
      if (this.isDown && this.user) {
        if (!this.question.downvotes.find(id => id === this.user.id)) {
          this.question.downvotes.push(this.user.id);
        }
      } else {
        this.question.downvotes = this.question.downvotes.filter(id => id !== this.user.id);
      }
    },
    // eslint-disable-next-line
    'question._id'() {
      if (this.question && this.user) {
        this.checkVote();
      }
    },
    isLogin() {
      if (this.question && this.user) {
        this.checkVote();
      }
    },
  },
  mounted() {
    this.fetchQuestion();
    if (this.question && this.user) {
      this.checkVote();
    }
  },
  data() {
    return {
      question: {
        title: '',
        description: '',
        creator: {},
        tags: [],
        upvotes: [],
        downvotes: [],
      },
      isUp: false,
      isDown: false,
    };
  },
  methods: {
    findTag(keyword) {
      this.$router.push('/');
      this.$store.dispatch('fetchQuestions');
      this.$store.commit('setSearch', keyword);
    },
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
      this.upvote();
    },
    down() {
      if (!this.isDown) {
        this.isDown = true;
        this.isUp = false;
      } else {
        this.isDown = false;
      }
      this.downvote();
    },
    upvote() {
      const { id } = this.$route.params;
      const { token } = localStorage;

      axios
        .patch(`/questions/${id}?upvote=${Number(this.isUp)}`, {}, { headers: { token } })
        // eslint-disable-next-line
        .then(({ data }) => {
          // eslint-disable-next-line
          //...
        })
        .catch((err) => {
          let message = null;
          if (err.response) {
          // eslint-disable-next-line
            message = err.response.data.message;
          } else {
            message = 'internal server error';
          }
          message += ', login first';
          this.$store.dispatch('notify', {
            message,
            type: 'error',
          });
          this.isUp = !this.isUp;
        });
    },
    downvote() {
      const { id } = this.$route.params;
      const { token } = localStorage;

      axios
        .patch(`/questions/${id}?downvote=${Number(this.isDown)}`, {}, { headers: { token } })
        // eslint-disable-next-line
        .then(({ data }) => {
          // eslint-disable-next-line
          //...
        })
        .catch((err) => {
          let message = null;
          if (err.response) {
          // eslint-disable-next-line
            message = err.response.data.message;
          } else {
            message = 'internal server error';
          }
          message += ', login first';
          this.$store.dispatch('notify', {
            message,
            type: 'error',
          });
          this.isDown = !this.isDown;
        });
    },
    removeQuestion() {
      const { id } = this.$route.params;
      const { token } = localStorage;

      this.$store.commit('loading', true);
      axios
        // eslint-disable-next-line
        .delete(`/questions/${id}`, { headers: { token } })
        .then(({ data }) => {
          this.$store.commit('loading', false);
          const { message } = data;

          this.$store.dispatch('notify', {
            message,
            type: 'success',
          });
          this.$router.push('/user/questions');
        })
        .catch((err) => {
          this.$store.commit('loading', false);
          const { message } = err.response.data;

          this.$store.dispatch('notify', {
            message, type: 'error',
          });
        });
    },
    fetchQuestion() {
      const { id } = this.$route.params;

      this.$store.commit('loading', true);
      axios
        // eslint-disable-next-line
        .get(`/questions/${id}`)
        .then(({ data }) => {
          this.$store.commit('loading', false);
          const { question } = data;

          this.question = question;
          this.$emit('listen', question);
        })
        .catch((err) => {
          this.$store.commit('loading', false);
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
