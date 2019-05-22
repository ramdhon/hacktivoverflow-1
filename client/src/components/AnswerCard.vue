<template>
  <v-card class="my-4">
    <v-card-title primary-title>
      <v-layout row>
        <v-flex sm9>
          <h3 class="display-1 mb-0">{{ answer.title }}</h3>
        </v-flex>
        <v-flex>
          <v-layout justify-end row>
            <p class="caption grey--text">
              {{ countTime }} ago created by {{ answer.creator.name }}
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
          <span v-html="answer.description"></span>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from '@/api/server';
import { mapState } from 'vuex';

export default {
  name: 'answerCard',
  computed: {
    ...mapState([
      'user',
      'isLogin',
    ]),
    totalVotes() {
      if (!this.answer) {
        return 0;
      }
      return this.answer.upvotes.length - this.answer.downvotes.length;
    },
    diffTime() {
      return (new Date()) - (new Date(this.answer.created));
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
        if (!this.answer.upvotes.find(id => id === this.user.id)) {
          this.answer.upvotes.push(this.user.id);
        }
      } else {
        this.answer.upvotes = this.answer.upvotes.filter(id => id !== this.user.id);
      }
    },
    isDown() {
      if (this.isDown && this.user) {
        if (!this.answer.downvotes.find(id => id === this.user.id)) {
          this.answer.downvotes.push(this.user.id);
        }
      } else {
        this.answer.downvotes = this.answer.downvotes.filter(id => id !== this.user.id);
      }
    },
    // eslint-disable-next-line
    'answer._id'() {
      if (this.answer && this.user) {
        this.checkVote();
      }
    },
    isLogin() {
      if (this.answer && this.user) {
        this.checkVote();
      }
    },
  },
  mounted() {
    if (this.answer && this.user) {
      this.checkVote();
    }
  },
  props: {
    answer: Object,
  },
  data() {
    return {
      isUp: false,
      isDown: false,
    };
  },
  methods: {
    checkVote() {
      if (this.answer.upvotes.find(id => id === this.user.id)) {
        this.isUp = true;
      }
      if (this.answer.downvotes.find(id => id === this.user.id)) {
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
      // eslint-disable-next-line
      const id = this.answer._id;
      const { token } = localStorage;

      axios
        // eslint-disable-next-line
        .patch(`/answers/${id}?upvote=${Number(this.isUp)}`, {}, { headers: { token } })
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

          this.$store.dispatch('notify', {
            message,
            type: 'error',
          });
          this.isUp = !this.isUp;
        });
    },
    downvote() {
      // eslint-disable-next-line
      const id = this.answer._id;
      const { token } = localStorage;

      axios
        // eslint-disable-next-line
        .patch(`/answers/${id}?downvote=${Number(this.isDown)}`, {}, { headers: { token } })
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

          this.$store.dispatch('notify', {
            message,
            type: 'error',
          });
          this.isDown = !this.isDown;
        });
    },
  },
};
</script>
