<template>
  <v-container fluid>
    <v-form ref="questionForm" @submit.prevent="upload" v-model="questionForm.valid">
      <v-text-field
        class="mb-2"
        color="orange"
        v-model="questionForm.title"
        :rules="questionForm.titleRules"
        label="Title"
        required
      ></v-text-field>
      <ckeditor
        :editor="editor"
        v-model="questionForm.description"
        tag-name="textarea"
        :config="editorConfig"
      >
      </ckeditor>
      <v-combobox
        class="mt-4"
        v-model="questionForm.tags"
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
        <v-btn type="submit" flat color="dark">Submit</v-btn>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import axios from '@/api/server';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'questionForm',
  components: {
    // ckeditor: CKEditor.component,
  },
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
      this.questionForm.tags.splice(this.questionForm.tags.indexOf(item), 1);
      this.questionForm.tags = [...this.questionForm.tags];
    },
    resetForm() {
      this.$refs.questionForm.reset(
        
      );
      this.questionForm.description = '';
    },
    upload() {
      const { title, description, tags } = this.questionForm;
      const payload = { formData: { title, description, tags }, token: localStorage.getItem('token') };

      this.$store.dispatch('upload', payload);
      this.$emit('close');
      this.resetForm();
    },
  },
};
</script>
