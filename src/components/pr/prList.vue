<template>
  <v-row>
    <v-dialog v-model="show">
      <v-card>
        <v-card-title>
          Product list
        </v-card-title>
        <v-card-text>
          {{products.grn_details}}
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-col>
      <v-card>
        <v-card-title>View GRNs</v-card-title>
        <v-card-text>
          <v-text-field label="Search" outlined v-model="search"></v-text-field>
          <v-data-table :items="items" :headers="headers" :search="search">
            <template v-slot:item.view="{ item }">
              <v-btn class="success" @click="viewGRN(item.id)">View</v-btn>
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
      show:false,
      search: "",
      items: [],
      headers: [
        { text: "GRN number", value: "id" },
        { text: "Supplier", value: "customer.fullName" },
        { text: "Date", value: "createdDate" },
        { text: "Purchase return status", value: "purchaseReturned" },
        { text: "View", value: "view", sortable: false },
      ],
      products:{}
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
    async viewGRN(id) {
       const productList = await this.$http.get(`/grn/${id}`);
       this.products = productList.data;

      this.show = true
    },
  },
};
</script>