<template>
  <v-container class="pt-5">
    <v-layout row>
      <v-flex class="pa-4" sm9>
        <v-slide-y-transition>
          <v-layout justify-center v-show="questionForm" row>
            <v-flex sm11>
              <v-layout justify-end row>
                <v-btn icon @click="questionForm = !questionForm">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-layout>
              <QuestionForm @close="questionForm = !questionForm"/>
            </v-flex>
          </v-layout>
        </v-slide-y-transition>
        <v-layout justify-end row>
          <v-btn @click="openForm" color="orange" dark>
            <v-icon>create</v-icon>&ensp;Question?
          </v-btn>
        </v-layout>
        <v-layout v-if="questions.length === 0 && !loading" justify-center row>
          <span class="title grey--text">There is no question yet.</span>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-list three-line>
              <QuestionList
                v-for="(question, index) in questions"
                :key="index"
                :question="question"
              />
            </v-list>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex class="pa-4" sm3>
        <WatchedTags v-show="isLogin"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import QuestionForm from '@/components/QuestionForm.vue';
import WatchedTags from '@/components/WatchedTags.vue';
import QuestionList from '@/components/QuestionList.vue';
import { mapState } from 'vuex';

export default {
  name: 'home',
  components: {
    QuestionForm,
    WatchedTags,
    QuestionList,
  },
  computed: {
    ...mapState([
      'isLogin',
      'questions',
      'loading',
    ]),
  },
  created() {
    this.$store.dispatch('fetchQuestions');
  },
  data() {
    return {
      questionForm: false,
    };
  },
  methods: {
    openForm() {
      if (!this.isLogin) {
        this.$store.dispatch('notify', { message: 'login first', type: 'warning' });
      } else {
        this.questionForm = !this.questionForm;
      }
    },
  },
};
</script>
