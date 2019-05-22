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
      <v-combobox
        class="mt-4"
        v-model="answerForm.tags"
        :items="items"
        label="Enter your tags"
        chips
        clearable
        prepend-icon="tags"
        solo
        multiple
      >
        <template v-slot:selection="data">
          <v-chip
            :selected="data.selected"
            close
            @input="remove(data.item)"
          >
            <strong>{{ data.item }}</strong>&nbsp;
          </v-chip>
        </template>
      </v-combobox>
      <v-layout justify-end row>
        <v-btn type="submit" flat color="dark">Send Answer</v-btn>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import axios from '@/api/server';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'answerForm',
  components: {
    // ckeditor: CKEditor.component,
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
      items: [],
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
    };
  },
  mounted() {
    this.fetchTags();
  },
  methods: {
    fetchTags() {
      axios
        .get('/tags')
        .then(({ data }) => {
          this.items = data.tags.map(item => item.title);
        })
        .catch((err) => {
          const { status } = err.response;

          if (status === 404) {
            this.items = [];
          } else {
            const { message } = err.response.data;

            this.$store.dispatch('notify', {
              message, type: 'error',
            });
          }
        });
    },
    remove(item) {
      this.answerForm.tags.splice(this.answerForm.tags.indexOf(item), 1);
      this.answerForm.tags = [...this.answerForm.tags];
    },
    resetForm() {
      this.$refs.answerForm.reset();
      this.answerForm.description = '';
    },
    upload() {
      const { title, description, tags } = this.answerForm;
      const { id } = this.$route.params;
      const formData = {
        title,
        description,
        tags,
        questionId: id,
      };

      this.$emit('upload', formData);
      this.resetForm();
    },
  },
};
</script>
