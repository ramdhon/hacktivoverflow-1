<template>
  <v-container class="pt-5" fluid>
    <v-layout row>
      <v-flex class="pa-4" sm1>
      </v-flex>
      <v-flex class="pa-4" sm8>
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
          <v-btn @click="openForm" color="orange"><v-icon>create</v-icon>&ensp;Question?</v-btn>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-list three-line>
              <div v-for="(question, index) in questions" :key="index">
                <v-list-tile @click="test" ripple>
                  <v-list-content>
                    <h1 class="title">{{ question.title }}</h1>
                  </v-list-content>
                </v-list-tile>
                <v-divider></v-divider>
              </div>
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
import { mapState } from 'vuex';

export default {
  name: 'home',
  components: {
    QuestionForm,
    WatchedTags,
  },
  computed: {
    ...mapState([
      'isLogin',
      'questions',
    ]),
  },
  data() {
    return {
      questionForm: false,
      items: [
        { header: 'Today' },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.",
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?",
        },
      ],
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
    test() {

    },
  },
};
</script>
