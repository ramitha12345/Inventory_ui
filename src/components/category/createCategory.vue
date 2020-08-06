<template>
  <v-row>
    <v-col cols="12">
      <v-form ref="categoryForm">
        <v-card>
          <v-card-title>
            {{
            `${isCreateComponent ? "Create Category" : "Update Category"}`
            }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="5">
                <v-text-field
                  label="Name"
                  outlined
                  v-model="name"
                  counter="30"
                  :error-messages="nameErrors"
                  @input="$v.name.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-textarea label="Description" outlined v-model="description"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="!isCreateComponent" class="warning" @click="PUT()">Update</v-btn>
            <v-btn v-else class="success" @click="POST()" :disabled="$v.$invalid">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
    <v-col>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{alert}}</v-alert>
    </v-col>
  </v-row>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  validations() {
    return {
      name: { required, maxLength: maxLength(30) },
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      if (!this.$v.name.required) errors.push("Name is required.");
      if (!this.$v.name.maxLength)
        errors.push("Maximum length for the name is 30.");
      return errors;
    },
  },
  mounted() {
    //check availability of id
    if (this.$route.query.id) {
      this.isCreateComponent = false;
      this.GET(this.$route.query.id);
      this.id = this.$route.query.id;
    }
  },
  data() {
    return {
      name: "",
      description: "",
      isCreateComponent: true,
      id: null,
      alertType: "error",
      hasAlert: false,
      alert: "",
    };
  },
  methods: {
    async POST() {
      try {
        console.log("name", this.name, "description", this.description);
        await this.$http.post("/category", {
          name: this.name,
          description: this.description,
        });
        this.$refs.categoryForm.reset();
        this.$v.$reset();
        this.alertType = "success";
        this.alert = "Category created successfully!";
        this.hasAlert = true;
      } catch (error) {
        if (error.response.status === 422) {
          this.alert = "Category name already exist";
        } else {
          this.alert = "Category creation fail!";
        }
        this.alertType = "error";
        this.hasAlert = true;
      }
    },
    async GET(id) {
      try {
        const data = await this.$http.get(`/category/${id}`);
        this.name = data.data.name;
        this.description = data.data.description;
        console.log(data.data);
      } catch (error) {
        alert("error");
      }
    },
    async PUT() {
      try {
        console.log("name", this.name, "description", this.description);
        await this.$http.put(`/category/${this.id}`, {
          name: this.name,
          description: this.description,
        });
      } catch (error) {
        alert("error");
      }
    },
  },
};
</script>