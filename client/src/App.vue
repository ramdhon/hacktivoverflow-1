<template>
  <v-app>
    <HeadBar/>
    <v-progress-linear
      v-show="loading"
      color="orange"
      :indeterminate="true"
    ></v-progress-linear>
    <div>
      <v-alert
        style="width:100%;position:absolute;z-index:1"
        transition="slide-y-reverse-transition"
        :value="notification.status"
        :type="notification.type"
      >
        {{ notification.message }}
      </v-alert>
    </div>
    <router-view/>
    <FootBar/>
  </v-app>
</template>

<script>
import HeadBar from '@/components/HeadBar.vue';
import FootBar from '@/components/FootBar.vue';
import { mapState } from 'vuex';

export default {
  name: 'App',
  components: {
    HeadBar,
    FootBar,
  },
  computed: {
    ...mapState([
      'loading',
      'notification',
    ]),
  },
};
</script>
