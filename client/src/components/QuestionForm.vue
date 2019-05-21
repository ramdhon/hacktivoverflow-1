<template>
  <v-form @submit.prevent="login" v-model="questionForm.valid">
    <v-text-field
      color="orange"
      v-model="questionForm.title"
      :rules="questionForm.titleRules"
      label="E-mail"
      required
    ></v-text-field>
    <v-layout justify-end row>
      <v-btn type="submit" flat color="dark">Login</v-btn>
    </v-layout>
  </v-form>
</template>

<script>
export default {
  name: 'questionForm',
  data() {
    return {
      questionForm: {
        valid: false,
        title: '',
        titleRules: [
          v => !!v || 'Title is required',
        ],
        description: '',
        tags: [],
      },
    };
  },
  methods: {
    resetForm() {
      this.questionForm.title = '';
      this.questionForm.description = '';
      this.questionForm.tags = [];
    },
    login() {
      const { title, description } = this.questionForm;

      this.$store.dispatch('upload', { title, description });
      this.$emit('close');
      this.resetForm();
    },
  },
};
</script>
