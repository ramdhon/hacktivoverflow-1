<template>
  <v-container fluid>
    <v-form ref="answerForm" @submit.prevent="upload" v-model="answerForm.valid">
      <v-text-field
        class="mb-2"
        color="orange"
        v-model="answerForm.title"
        :rules="answerForm.titleRules"
        label="Title"
        required
      ></v-text-field>
      <ckeditor
        :editor="editor"
        v-model="answerForm.description"
        tag-name="textarea"
        :config="editorConfig"
      >
      </ckeditor>
      <v-layout justify-end row>
        <v-btn type="submit" flat color="dark">Send Answer</v-btn>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { mapState } from 'vuex';
export default {
  name: 'answerForm',
  components: {
    // ckeditor: CKEditor.component,
  },
  computed: {
    ...mapState([
      'isLogin',
    ]),
  },
  data() {
    return {
      answerForm: {
        valid: false,
        title: '',
        titleRules: [
          v => !!v || 'Title is required',
        ],
        description: '',
        tags: [],
      },
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.answerForm.reset();
      this.answerForm.description = '';
    },
    upload() {
      if (!this.isLogin) {
        this.$store.dispatch('notify', {
          message: 'you must login first to answer the question',
          type: 'warning',
        })
      } else {
        const { title, description } = this.answerForm;
        const { id } = this.$route.params;
        const formData = {
          title,
          description,
          questionId: id,
        };
        this.$emit('upload', formData);
        this.resetForm();
      }
    },
  },
};
</script>
