<template>
  <v-card>
    <v-container>
      <v-card-title>
        <h1 class="display-1">Register</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="registerForm" @submit.prevent="register" v-model="registerForm.valid">
          <v-text-field
            color="orange"
            v-model="registerForm.name"
            :rules="registerForm.nameRules"
            :counter="30"
            label="Full name"
            required
          ></v-text-field>
          <v-text-field
            color="orange"
            v-model="registerForm.email"
            :rules="registerForm.emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            color="orange"
            v-model="registerForm.password"
            :rules="registerForm.passwordRules"
            :counter="6"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-layout justify-end row>
            <v-btn type="submit" flat color="dark">Register</v-btn>
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
      registerForm: {
        valid: false,
        name: '',
        nameRules: [
          v => !!v || 'Name is required',
          v => v.length <= 30 || 'Name must be less than 30 characters',
        ],
        email: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          // eslint-disable-next-line
          v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid',
        ],
        password: '',
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length >= 6 || 'Password must contain at least 6 characters',
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.registerForm.reset();
    },
    register() {
      const { name, email, password } = this.registerForm;

      this.$store.dispatch('register', { name, email, password });
      this.$emit('close');
      this.resetForm();
    },
  },
};
</script>
