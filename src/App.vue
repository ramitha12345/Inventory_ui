<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" v-if="token" dark>
      <v-list>
        <template v-for="item in permissions">
          <v-list-group
            v-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              @click="$router.push(child.path)"
              color="red"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content :style="child.path === $route.path ? 'color:red;' : ''">
                <v-list-item-title>{{ child.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" @click="$router.push(item.path)">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app class="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="token" dark></v-app-bar-nav-icon>
      <v-icon dark large class="mr-3">fa-bolt</v-icon>

      <v-toolbar-title class="white--text">{{projectName}}</v-toolbar-title>
      <!-- <v-chip v-if="token" class="ml-1 white--text" color="#1E90FF">{{name}}</v-chip>-->
      <v-spacer ></v-spacer>

      <v-btn v-if="token" @click="onLogout()" class="success">logout</v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid grid-list-sm>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState(["token"]),
  },
  name: "App",

  components: {},

  data: () => ({
    projectName: "Ramitha Inventory",
    drawer: true,

    permissions: [
      {
        text: "Create User",
        path: "/user",
        icon: "fa-",
      },
      {
        text: "User list",
        path: "/userList",
        icon: "fa-",
      },
      {
        text: "Create Customer",
        path: "/customer",
        icon: "fa-",
      },
      {
        text: "Customer List",
        path: "/customerList",
        icon: "fa-",
      },
      {
        text: "Create Category",
        path: "/category",
        icon: "fa-",
      },
      {
        text: "Category List",
        path: "/categoryList",
        icon: "fa-",
      },
      {
        text: "Create Product",
        path: "/product",
        icon: "fa-",
      },
      {
        text: "Product List",
        path: "/productList",
        icon: "fa-",
      },
      {
        text: "Reorder Level Report",
        path: "/report",
        icon: "fa-",
      },
    ],
  }),
  methods: {
    ...mapActions(["logout"]),
    async onLogout(){
      this.logout();
      this.$router.replace('/')
    }
  },
};
</script>
<style>
.btn {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}
</style>
