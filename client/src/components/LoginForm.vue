<template>
  <v-card>
    <v-container>
      <v-card-title>
        <h1 class="display-1">Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login" v-model="loginForm.valid">
          <v-text-field
            color="orange"
            v-model="loginForm.email"
            :rules="loginForm.emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            color="orange"
            v-model="loginForm.password"
            :rules="loginForm.passwordRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-layout justify-end row>
            <v-btn type="submit" flat color="dark">Login</v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'loginForm',
  data() {
    return {
      loginForm: {
        valid: false,
        email: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          // eslint-disable-next-line
          v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid',
        ],
        password: '',
        passwordRules: [
          v => !!v || 'Password is required',
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.loginForm.email = '';
      this.loginForm.password = '';
    },
    login() {
      const { email, password } = this.loginForm;

      this.$store.dispatch('login', { email, password });
      this.$emit('close');
      this.resetForm();
    },
  },
};
</script>
