<template>
  <v-toolbar>
    <v-text-field
      v-model="search"
      color="orange"
      hide-details
      prepend-icon="search"
      single-line
    ></v-text-field>
    <router-link to="/">
      <v-toolbar-title
        class="orange--text"
        @click="home"
      >
        <v-icon color="orange">question_answer</v-icon>&ensp;hO.
      </v-toolbar-title>
    </router-link>

    <v-spacer></v-spacer>

    <v-dialog
      v-model="loginWindow"
      max-width="30%"
    >
      <LoginForm @close="loginWindow = !loginWindow"/>
    </v-dialog>

    <v-dialog
      v-model="registerWindow"
      max-width="30%"
    >
      <RegisterForm @close="registerWindow = !registerWindow"/>
    </v-dialog>

    <v-spacer></v-spacer>

    <v-toolbar-items v-if="!isLogin">
      <v-btn
        flat
        @click.stop="loginWindow = true"
      >
        LOGIN
      </v-btn>
      <v-btn
        flat
        @click.stop="registerWindow = true"
      >
        REGISTER
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items v-else>
      <v-btn @click="$router.push('/user/questions')" :color="isMyQuestions ? 'orange' : ''" flat>
        <v-icon>message</v-icon>&ensp;My Questions
      </v-btn>
      <v-btn @click.prevent="logout" icon flat>
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar-items>

  </v-toolbar>
</template>

<style scoped>
  a {
    text-decoration: none;
  }
</style>

<script>
import { mapMutations, mapState } from 'vuex';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';

export default {
  name: 'headBar',
  components: {
    LoginForm,
    RegisterForm,
  },
  watch: {
    search(val) {
      this.$router.push('/');
      this.$store.dispatch('fetchQuestions');
      this.$store.commit('setSearch', val);
    },
  },
  computed: {
    ...mapState([
      'isLogin',
    ]),
    isMyQuestions() {
      return this.$route.path === '/user/questions';
    },
  },
  data() {
    return {
      search: '',
      loginWindow: false,
      registerWindow: false,
    };
  },
  methods: {
    ...mapMutations([
      'logout',
    ]),
    home() {
      this.$store.dispatch('fetchQuestions');
      this.$store.commit('setSearch', '');
    },
  },
};
</script>
