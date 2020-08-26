<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>View GRNs</v-card-title>
        <v-card-text>
          <v-text-field label="Search" outlined v-model="search"></v-text-field>
          <v-data-table :items="items" :headers="headers" :search="search">
            <template v-slot:item.view="{ item }">
              <v-btn class="success" @click="viewGRN(item)">View</v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  mounted() {
    this.GET();
  },
  data() {
    return {
      search: "",
      items: [],
      headers: [
        { text: "GRN number", value: "id" },
        { text: "Supplier", value: "fullName" },
        { text: "Date", value: "createdAt" },
        { text: "Purchase return status", value: "isReturn" },
        { text: "View", value: "view", sortable: false },
      ],
    };
  },
  methods: {
    async GET() {
      try {
        const data = await this.$http.get("/grn");
        this.items = data.data;
      } catch (error) {
        alert("error");
      }
    },
    async viewGRN() {},
  },
};
</script>