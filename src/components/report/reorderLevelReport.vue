<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>Reorder Level Report</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-select
                :items="orderBys"
                outlined
                v-model="order"
                item-text="name"
                item-value="value"
                label="Order By"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                :items="statusList"
                outlined
                v-model="status"
                item-text="name"
                item-value="value"
                label="Status"
              ></v-select>
            </v-col>
          </v-row>
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
  data() {
    return {
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
      orderBys: [
        { name: "Id", value: "id" },
        { name: "Id Desending", value: "id DESC" },
        { name: "Name", value: "name" },
        { name: "Name Desending", value: "name DESC" },
      ],
      status:"",
      statusList: [
        { name: "Active", value: true },
        { name: "Inactive", value: false },
        { name: "All", value: "all" },
      ],
    };
  },
  methods: {
    async POST() {
      try {
        const data = await this.$http.post("/report/reorderLevel", {
          orderBy:this.order,
          status:this.status
        });
        this.items = data.data;
        return data.data;
      } catch (error) {
        alert("error");
      }
    },
  },
};
</script>