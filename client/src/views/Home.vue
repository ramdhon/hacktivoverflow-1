<template>
  <v-container fluid>
    <v-layout row>
      <v-flex class="pa-4" sm3>
        FIRST
      </v-flex>
      <v-flex class="pa-4" sm6>
        <v-layout row>
          <v-flex>
            
          </v-flex>
        </v-layout>
        <v-layout justify-end row>
          <v-btn flat>Question?</v-btn>
        </v-layout>
      </v-flex>
      <v-flex class="pa-4" sm3>
        THIRD
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'home',
  components: {
  },
};
</script>
