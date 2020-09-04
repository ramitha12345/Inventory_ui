<template>
  <v-row>
    <v-col cols="12">
      <v-form ref="invoiceForm">
        <v-card>
          <v-card-title>Create Invoice</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  :items="customers"
                  item-value="id"
                  item-text="fullName"
                  v-model="customerId"
                  label="Select a customer"
                  outlined
                  :error-messages="customerIdErrors"
                  @input="$v.customerId.$touch()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                  :items="products"
                  item-value="id"
                  item-text="name"
                  v-model="productId"
                  label="Select a product"
                  outlined
                  :error-messages="productIdErrors"
                  @input="$v.productId.$touch()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Price"
                  type="number"
                  outlined
                  v-model="price"
                  :error-messages="priceErrors"
                  @input="$v.price.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="QTY"
                  type="number"
                  outlined
                  v-model="qty"
                  :error-messages="qtyErrors"
                  @input="$v.qty.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-col cols="12">
              <v-btn
                class="success"
                block
                @click="addToList(price,qty,productId)"
                :disabled="$v.$invalid"
              >Add</v-btn>
            </v-col>
            <v-col cols="12">
              <v-data-table :items="productsList" :headers="headers">
                <template v-slot:item.remove="{ item }">
                  <v-btn @click="onRemove(item.item_id)" class="error">
                    <v-icon>fa-trash</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
            <h1>{{total}} LKR</h1>
          </v-card-text>
          <v-card-actions>
            <v-btn class="success" @click="POST()" :disabled="isDisable">Create</v-btn>
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
import { required, decimal, integer } from "vuelidate/lib/validators";
export default {
  validations() {
    return {
      customerId: { required },
      productId: { required },
      price: { required, decimal },
      qty: { required, integer },
    };
  },
  computed: {
    customerIdErrors() {
      const errors = [];
      if (!this.$v.customerId.$dirty) return errors;
      if (!this.$v.customerId.required) errors.push("Customer is required.");
      return errors;
    },
    productIdErrors() {
      const errors = [];
      if (!this.$v.productId.$dirty) return errors;
      if (!this.$v.productId.required) errors.push("Product is required.");
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
    isDisable() {
      if (this.customerId && this.productsList.length) {
        return false;
      } else {
        return true;
      }
    },
    total() {
      if (this.productsList.length) {
        return this.productsList
          .map((e) => Number(e.price) * Number(e.qty))
          .reduce((a, b) => a + b);
      } else {
        return 0;
      }
    },
  },
  mounted() {
    this.GET();
  },
  data() {
    return {
      name: "",
      price: "",
      qty: "",
      alertType: "error",
      hasAlert: false,
      alert: "",
      customers: [],
      customerId: "",
      products: [],
      productId: "",
      productsList: [],
      headers: [
        {
          text: "Name",
          value: "name",
          align: "center",
        },
        {
          text: "Qty",
          value: "qty",
          align: "center",
        },
        {
          text: "Price",
          value: "price",
          align: "center",
        },
        {
          text: "Remove",
          value: "remove",
          align: "center",
        },
      ],
    };
  },
  methods: {
    async POST() {
      try {
        await this.$http.post("/invoice", {
          productsList: this.productsList,
          customerId: this.customerId,
        });
        // this.$refs.invoiceForm.reset();
        // this.$v.$reset();
        this.alertType = "success";
        this.alert = "Invoice created successfully!";
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

    async GET() {
      try {
        const data = await this.$http.get(`invoice/util`);
        this.customers = data.data.customers;
        this.products = data.data.products;
      } catch (error) {
        alert("error");
      }
    },

    addToList(price, qty, productId) {
      //check already in the list
      const isInList = this.productsList.find(
        (e) => Number(e.productId) === Number(productId)
      );
      if (isInList) {
        alert("This item already in the list");
        return;
      }
      const item = this.products.find((e) => e.id === Number(productId));
      const name = item.name;
      this.productsList.push({
        name,
        price,
        qty,
        productId,
      });
    },
    onRemove(productId) {
      const index = this.productsList.findIndex(
        (e) => Number(e.productId) === Number(productId)
      );
      this.productsList.splice(index, 1);
    },
  },
};
</script>