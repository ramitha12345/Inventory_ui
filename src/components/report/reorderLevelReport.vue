<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>Reorder Level Report</v-card-title>
        <v-card-text>
          <v-select :items="orderBys" outlined v-model="order" label="Order By"></v-select>
          <v-data-table :items="items" :headers="headers"></v-data-table>
        </v-card-text>
      </v-card>
      <JsonExcel
        class="btn"
        :fetch="POST"
        :fields="json_fields"
        name="Reorder Level Report.csv"
        type="csv"
      >Download Excel</JsonExcel>
    </v-col>
  </v-row>
</template>

<script>
import JsonExcel from "vue-json-excel";
export default {
  components: {
    JsonExcel,
  },
  mounted() {
    this.POST();
  },
  data() {
    return {
      items: [],
      headers: [
        { text: "Id", value: "id" },
        { text: "Name", value: "name" },
        { text: "Quantity", value: "qty" },
        { text: "Price", value: "price" },
        { text: "Reorder Level", value: "reorderLevel" },
        { text: "Size", value: "size" },
      ],
      json_fields: {
        Id: "id",
        Name: "name",
        Quantity: "qty",
        "Reorder Level": "reorderLevel",
        Price: "price",
        Size: "size",
        CreatedAt: "createdAt",
      },
      order: "",
      orderBys: ["id", "Name", "Quantity", "Reorder Level"],
    };
  },
  methods: {
    async POST() {
      try {
        const data = await this.$http.post("/report", {
          orderBy: "id",
        });
        this.items = data.data;
        return data.data;
      } catch (error) {
        alert("error");
      }
    },
    // async GET(id) {
    //   try {
    //     const data = await this.$http.get(`/product/${id}`);
    //     this.name = data.data.name;
    //     this.price = data.data.price;
    //     this.qty = data.data.qty;
    //     this.reorderLevel = data.data.reorderLevel;
    //     this.size = data.data.size;
    //     this.isImported = data.data.isImported;
    //     console.log(data.data);
    //   } catch (error) {
    //     alert("error");
    //   }
    // },
    // async PUT() {
    //   try {
    //     await this.$http.post(`/product/${this.id}`, {
    //       name: this.name,
    //       price: this.price,
    //       qty: this.qty,
    //       reorderLevel: this.reorderLevel,
    //       size: this.size,
    //       isImported: this.isImported,
    //     });
    //   } catch (error) {
    //     alert("error");
    //   }
    // },
  },
};
</script>