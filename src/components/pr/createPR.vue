<template>
  <v-row>
    <v-dialog v-model="show" max-width="350px">
      <v-card>
        <v-card-title> Return </v-card-title>
        <v-card-text>
          <v-autocomplete
            :items="quantities"
            outlined
            v-model="qty"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn block class="primary" @click="addToList()">return</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col cols="12">
      <v-form ref="grnForm">
        <v-card>
          <v-card-title>Create Purchase return</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  :items="grns"
                  item-value="id"
                  item-text="id"
                  v-model="grnId"
                  label="load a grn"
                  outlined
                  :error-messages="supplierIdErrors"
                  @input="$v.grnId.$touch()"
                  @change="loadItems"
                ></v-autocomplete>
              </v-col>
              <!-- <v-col cols="12" md="4">
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
              </v-col> -->
            </v-row>
            <!-- <v-col cols="12">
              <v-btn
                class="success"
                block
                @click="addToList(price,qty,productId)"
                :disabled="$v.$invalid"
              >Add</v-btn>
            </v-col> -->
            <v-col cols="12">
      
              <v-data-table :items="items" :headers="headers">
                <template v-slot:item.remove="{ item }">
                  <v-btn @click="addToReturn(item.id)" class="error">
                    <!-- <v-icon>fa-trash</v-icon> -->
                    return
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="12">
      {{productsList}}
              <v-data-table :items="productsList" :headers="headersList">
                
              </v-data-table>
            </v-col>
            
            <!-- <h1>{{ total }} LKR</h1> -->
          </v-card-text>
          <v-card-actions>
            <v-btn class="success" @click="POST()" :disabled="isDisable"
              >Create</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
    <v-col>
      <v-alert v-model="hasAlert" dismissible :type="alertType">{{
        alert
      }}</v-alert>
    </v-col>
  </v-row>
</template>

<script>
import { required, integer } from "vuelidate/lib/validators";
const priceValidation = (value) => {
  return Number(value) > 30;
};
export default {
  validations() {
    return {
      grnId: { required },
      productId: { required },
      price: { required, priceValidation },
      qty: { required, integer },
    };
  },
  computed: {
    supplierIdErrors() {
      const errors = [];
      if (!this.$v.grnId.$dirty) return errors;
      if (!this.$v.grnId.required) errors.push("Supplier is required.");
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
      if (!this.$v.price.priceValidation)
        errors.push("Price should be greather than 50 LKR.");
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
      if (this.grnId && this.productsList.length) {
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
      grns: [],
      grnId: "",
      products: [],
      productId: "",
      productsList: [],
      headersList:[
         {
          text: "Product",
          value: "productId",
          align: "center",
        },
        {
          text: "Qty",
          value: "qty",
          align: "center",
        },
      ],
      headers: [
        {
          text: "Id",
          value: "id",
          align: "center",
        },
        {
          text: "Product",
          value: "productId",
          align: "center",
        },
        {
          text: "Qty",
          value: "qty",
          align: "center",
        },
        {
          text: "Return",
          value: "remove",
          align: "center",
        },
      ],
      items: [],
      show: true,
      quantities: [],
      // productsList:[]
    };
  },
  methods: {
    async POST() {
      try {
        await this.$http.post("/grn", {
          productsList: this.productsList,
          grnId: this.grnId,
        });
        // this.$refs.grnForm.reset();
        // this.$v.$reset();
        this.alertType = "success";
        this.alert = "GRN created successfully!";
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
        const data = await this.$http.get(`grn`);
        console.log("grn list", data.data);
        this.grns = data.data.filter((e) => !e.isReturn);
        // this.grns = data.data.grns;
        // this.products = data.data.products;
      } catch (error) {
        alert("error");
      }
    },

    // addToList(price, qty, productId) {
    //   //check already in the list
    //   const isInList = this.productsList.find(
    //     (e) => Number(e.productId) === Number(productId)
    //   );
    //   if (isInList) {
    //     alert("This item already in the list");
    //     return;
    //   }
    //   const item = this.products.find((e) => e.id === Number(productId));
    //   const name = item.name;
    //   this.productsList.push({
    //     name,
    //     price: Math.abs(price).toFixed(2),
    //     qty: Math.abs(qty),
    //     productId,
    //   });
    // },
    addToReturn(productId) {
      const item = this.items.find((e) => e.id === productId);

      const maxQty = item.qty;
      this.productId = productId;

      const quatities = [];
      for (let index = 0; index < maxQty; index++) {
        quatities.push(index + 1);
      }
      this.quantities = quatities;

      this.show = true;
    },
    async loadItems() {
      try {
        const data = await this.$http.get(`grn/${this.grnId}`);

        this.items = data.data.grn_details;
        // this.grns = data.data.grns;
        // this.products = data.data.products;
      } catch (error) {
        alert("error");
      }
    },
    addToList() {
      this.productsList.push({
        productId: this.productId,
        qty: this.qty,
      });
      this.show = false
    },
  },
};
</script>