<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>Category Report</v-card-title>
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
            <v-col cols="12">
              <v-subheader>Created after</v-subheader>
              <v-date-picker v-model="date" landscape :max="maxDate"></v-date-picker>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <JsonExcel
            class="btn"
            :fetch="POST"
            :fields="json_fields"
            name="category report.csv"
            type="csv"
          >Download report</JsonExcel>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import JsonExcel from "vue-json-excel";
export default {
  mounted() {
    function formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }

    this.maxDate = formatDate(new Date)
  },
  components: {
    JsonExcel,
  },
  data() {
    return {
      json_fields: {
        Id: "id",
        Name: "name",
        Description: "description",
        CreatedAt: "createdAt",
      },
      order: "",
      orderBys: [
        { name: "Id", value: "id" },
        { name: "Id Desending", value: "id DESC" },
        { name: "Name", value: "name" },
        { name: "Name Desending", value: "name DESC" },
      ],
      status: "",
      statusList: [
        { name: "Active", value: true },
        { name: "Inactive", value: false },
        { name: "All", value: "all" },
      ],
      date: "",
      maxDate: "",
    };
  },
  methods: {
    async POST() {
      try {
        const data = await this.$http.post("/report/category", {
          orderBy: this.order,
          status: this.status,
          date:this.date
        });
        if (data.data.length === 0) {
          alert('No data found in this report')
        }
        this.items = data.data;
        return data.data;
      } catch (error) {
        alert("error");
      }
    },
  },
};
</script>