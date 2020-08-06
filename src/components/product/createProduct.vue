<template>
  <v-row>
    <v-col cols="12">
      <v-form ref="productForm">
        <v-card>
          <v-card-title>
            {{
            `${isCreateComponent ? "Create Product" : "Update Product"}`
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
              <v-col cols="12" md="3">
                <v-radio-group v-model="isImported" row>
                  <v-radio label="Imported" value="true"></v-radio>
                  <v-radio label="Local" value="false"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Price"
                  outlined
                  v-model="price"
                  :error-messages="priceErrors"
                  @input="$v.price.$touch()"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Quantity"
                  outlined
                  v-model="qty"
                  :error-messages="qtyErrors"
                  @input="$v.qty.$touch()"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Reorder Level"
                  outlined
                  v-model="reorderLevel"
                  :error-messages="reorderLevelErrors"
                  @input="$v.reorderLevel.$touch()"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select :items="sizes" outlined v-model="size" label="Size"></v-select>
              </v-col>
            </v-row>
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
import {
  required,
  maxLength,
  decimal,
  integer,
} from "vuelidate/lib/validators";
export default {
  validations() {
    return {
      name: { required, maxLength: maxLength(30) },
      price: { required, decimal },
      qty: { required, integer },
      reorderLevel: { required, integer },
      size: { required },
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
    priceErrors() {
      const errors = [];
      if (!this.$v.price.$dirty) return errors;
      if (!this.$v.price.required) errors.push("Price is required.");
      if (!this.$v.price.decimal) errors.push("Price should be only decimal");
      return errors;
    },
    qtyErrors() {
      const errors = [];
      if (!this.$v.qty.$dirty) return errors;
      if (!this.$v.qty.required) errors.push("Quantity is required.");
      if (!this.$v.qty.integer) errors.push("Quantity should be only integers");
      return errors;
    },
    reorderLevelErrors() {
      const errors = [];
      if (!this.$v.reorderLevel.$dirty) return errors;
      if (!this.$v.reorderLevel.required)
        errors.push("Reorder Level is required.");
      if (!this.$v.reorderLevel.integer)
        errors.push("Reorder Level should be only integers");
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
      price: "",
      qty: "",
      reorderLevel: "",
      size: "M",
      isImported: true,
      isCreateComponent: true,
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "N/A"],
      alertType: "error",
      hasAlert: false,
      alert: "",
    };
  },
  methods: {
    async POST() {
      try {
        await this.$http.post("/product", {
          name: this.name,
          price: this.price,
          qty: this.qty,
          reorderLevel: this.reorderLevel,
          size: this.size,
          isImported: this.isImported,
        });
        this.$refs.productForm.reset();
        this.$v.$reset();
        this.alertType = "success";
        this.alert = "Product created successfully!";
        this.hasAlert = true;
      } catch (error) {
        if (error.response.status === 422) {
          this.alert = "Product already exist";
        } else {
          this.alert = "Product creation fail !";
        }
        this.alertType = "error";
        this.hasAlert = true;
      }
    },
    async GET(id) {
      try {
        const data = await this.$http.get(`/product/${id}`);
        this.name = data.data.name;
        this.price = data.data.price;
        this.qty = data.data.qty;
        this.reorderLevel = data.data.reorderLevel;
        this.size = data.data.size;
        this.isImported = data.data.isImported;
        console.log(data.data);
      } catch (error) {
        alert("error");
      }
    },
    async PUT() {
      try {
        await this.$http.post(`/product/${this.id}`, {
          name: this.name,
          price: this.price,
          qty: this.qty,
          reorderLevel: this.reorderLevel,
          size: this.size,
          isImported: this.isImported,
        });
      } catch (error) {
        alert("error");
      }
    },
  },
};
</script>