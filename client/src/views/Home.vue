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
          <v-btn @click="openForm" color="orange" dark><v-icon>create</v-icon>&ensp;Question?</v-btn>
        </v-layout>
        <v-layout row>
          <v-flex>
            <v-list three-line>
              <div v-for="(question, index) in questions" :key="index">
                <v-list-tile @click="test" ripple>
                    <v-layout row>
                      <v-flex sm2>
                        <v-layout row>
                          <v-flex sm6>
                            <v-layout row justify-center>
                              <h1 class="display-1 grey--text">
                                0
                              </h1>
                            </v-layout>
                            <v-layout row justify-center>
                              <span class="caption">votes</span>
                            </v-layout>
                          </v-flex>
                          <v-flex sm6>
                            <v-layout row justify-center>
                              <h1 class="display-1 grey--text">
                                0
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
                          <v-chip small v-for="(tag, index) in tags" :key="index">{{ tag }}</v-chip>
                        </v-layout>
                      </v-flex>
                      <v-flex sm2>
                        
                      </v-flex>
                    </v-layout>
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
      tags: ['lorem', 'ipsum', 'dolon', 'ist'],
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
