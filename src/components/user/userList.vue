<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>User List</v-card-title>
        <v-card-text>
          <v-text-field label="Search" outlined v-model="search"></v-text-field>
          <v-data-table :items="items" :headers="headers" :search="search">
            <template v-slot:item.update="{ item }">
              <v-btn class="warning" @click="UPDATE(item.id)">update</v-btn>
            </template>
            <template v-slot:item.changestatus="{ item }">
              <v-btn
                :class="{
                  error: item.status == true,
                  success: !item.status == true,
                }"
                @click="CHANGESTATUS(item.id,item.status)"
              >{{ item.status == true ? "Enable" : "Disable" }}</v-btn>
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
        { text: "Id", value: "id" },
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Gender", value: "g" },
        { text: "Email", value: "email" },
        { text: "NIC", value: "nic" },
        { text: "Role", value: "role" },
        { text: "Last Seen", value: "lastSeenDate" },
        { text: "Update", value: "update" },
        { text: "Change Status", value: "changestatus" },
      ],
    };
  },
  methods: {
    async GET() {
      try {
        const data = await this.$http.get("/user");
        this.items = data.data;
      } catch (error) {
        alert("error");
      }
    },
    async UPDATE(id) {
      try {
        this.$router.push({ path: "/user", query: { id } });
      } catch (error) {
        alert("error");
      }
    },
    async CHANGESTATUS(id, status) {
      try {
        status = !status;
        await this.$http.put(`/user/${id}`, { status });
        this.GET();
      } catch (error) {
        alert("error");
      }
    },
  },
};
</script>