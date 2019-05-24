<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="title mb-0"><v-icon>remove_red_eye</v-icon>&ensp;Watched Tags</h3>
    </v-card-title>

    <v-card-text>
      <v-layout v-if="watched.length === 0 && !openDialog" justify-center>
        <span class="grey--text">No tags set.</span>
      </v-layout>
      <v-layout v-if="!openDialog" row wrap>
        <v-chip small v-for="(tag, index) in watched" :key="index">{{ tag }}</v-chip>
      </v-layout>
      <v-form v-else @submit.prevent="updateWatched">
        <v-combobox
          class="mt-4"
          v-model="tagForm.tags"
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
              small
              :selected="data.selected"
              close
              @input="remove(data.item)"
            >
              <strong>{{ data.item }}</strong>&nbsp;
            </v-chip>
          </template>
        </v-combobox>
        <v-layout justify-end row>
          <v-btn type="submit" flat color="dark">Update</v-btn>
        </v-layout>
      </v-form>
      <v-layout justify-end row>
        <v-btn @click="openEdit" icon flat>
          <v-icon v-if="!openDialog">
            create
          </v-icon>
          <v-icon v-else>
            close
          </v-icon>
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from '@/api/server';

export default {
  name: 'watchedTags',
  mounted() {
    this.fetchTags();
    this.fetchWatched();
  },
  data() {
    return {
      openDialog: false,
      tagForm: {
        tags: [],
      },
      watched: [],
      items: [],
    };
  },
  methods: {
    remove(item) {
      this.tagForm.tags.splice(this.tagForm.tags.indexOf(item), 1);
      this.tagForm.tags = [...this.tagForm.tags];
    },
    openEdit() {
      this.tagForm.tags = this.watched;
      this.openDialog = !this.openDialog;
    },
    fetchTags() {
      axios
        .get('/tags')
        .then(({ data }) => {
          const { tags } = data;

          this.items = tags.map(tag => tag.title);
        })
        .catch((err) => {
          const { status } = err.response;

          if (status === 404) {
            this.items = [];
          }
        });
    },
    fetchWatched() {
      const { token } = localStorage;

      axios
        .get('/user/watched', { headers: { token } })
        .then(({ data }) => {
          const { watched } = data;

          this.watched = watched.tags;
        })
        .catch((err) => {
          const { status } = err.response;

          if (status === 404) {
            this.tagForm.tags = [];
          } else {
            const { message } = err.response.data;
            this.$store.dispatch('notify', {
              message,
              type: 'error',
            });
          }
        });
    },
    updateWatched() {
      const { tags } = this.tagForm;
      const { token } = localStorage;

      this.$store.commit('loading', true);
      axios
        .patch('/user/watched', { tags }, { headers: { token } })
        .then(({ data }) => {
          this.$store.commit('loading', false);
          const { message, updatedWatched } = data;

          this.$store.dispatch('notify', {
            message,
            type: 'success',
          });
          this.watched = updatedWatched.tags;
          this.openDialog = !this.openDialog;
        })
        .catch((err) => {
          this.$store.commit('loading', false);
          const { message } = err.response.data;
          this.$store.dispatch('notify', {
            message,
            type: 'error',
          });
        });
    },
  },
};
</script>
