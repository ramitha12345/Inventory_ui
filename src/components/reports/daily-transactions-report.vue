<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title>
            <span class="headline">
              Today transactions report
            </span>
          </v-card-title>
          <v-card-text>
            <v-data-table :items="items" :headers="headers">
              <template slot="items" slot-scope="props"> </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Type",
          value: null,
        },
        {
          text: "Number",
          value: null,
        },
      ],
      items: [],
    };
  },
  methods: {
    async GET() {
      try {
        await this.$http.get("reports/today-transactions");
       
      } catch (error) {
        // eslint-disable-next-line
         console.log(error)
      }
    },
  },
};
</script>
