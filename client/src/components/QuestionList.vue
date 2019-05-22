<template>
  <div>
    <v-list-tile @click="goToQuestion" ripple>
        <v-layout row>
          <v-flex sm2>
            <v-layout row>
              <v-flex sm6>
                <v-layout row justify-center>
                  <h1 class="display-1 grey--text">
                    {{ totalVotes }}
                  </h1>
                </v-layout>
                <v-layout row justify-center>
                  <span class="caption">votes</span>
                </v-layout>
              </v-flex>
              <v-flex sm6>
                <v-layout row justify-center>
                  <h1 class="display-1 grey--text">
                    {{ totalAnswers }}
                  </h1>
                </v-layout>
                <v-layout row justify-center>
                  <span class="caption">answers</span>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex class="px-3" sm8>
            <p class="text-truncate title ">{{ question.title }}</p>
            <v-layout row wrap>
              <v-chip small label color="orange" text-color="white">
                <v-icon left>label</v-icon>Tags
              </v-chip>
              <v-chip small v-for="(tag, index) in question.tags" :key="index">
                {{ tag.title }}
              </v-chip>
            </v-layout>
          </v-flex>
          <v-flex sm2>
            <p class="caption grey--text">
              {{ countTime }} ago created by {{ question.creator.name }}
            </p>
          </v-flex>
        </v-layout>
    </v-list-tile>
    <v-divider></v-divider>
  </div>
</template>

<script>
import axios from '@/api/server';

export default {
  name: 'questionList',
  props: {
    question: Object,
  },
  computed: {
    totalAnswers() {
      return this.answers.length;
    },
    totalVotes() {
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
  mounted() {
    if (this.question) {
      this.fetchAnswers();
    }
  },
  data() {
    return {
      answers: [],
    };
  },
  methods: {
    fetchAnswers() {
      axios
        // eslint-disable-next-line
        .get(`/questions/${this.question._id}/answers`)
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
    goToQuestion() {
      // eslint-disable-next-line
      this.$router.push(`/questions/${this.question._id}`);
    },
  },
};
</script>
