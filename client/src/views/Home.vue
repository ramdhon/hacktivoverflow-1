<template>
  <v-container class="pt-5" fluid>
    <v-layout row>
      <v-flex class="pa-4" sm2>
        FIRST
      </v-flex>
      <v-flex class="pa-4" sm7>
        <v-slide-y-transition>
          <v-layout v-show="questionForm" row>
            <v-flex>
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
          <v-btn @click="questionForm = !questionForm" color="orange">Question?</v-btn>
        </v-layout>
      </v-flex>
      <v-flex class="pa-4" sm3>
        THIRD
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import QuestionForm from '@/components/QuestionForm.vue';

export default {
  name: 'home',
  components: {
    QuestionForm,
  },
  data() {
    return {
      questionForm: false,
    };
  },
};
</script>
