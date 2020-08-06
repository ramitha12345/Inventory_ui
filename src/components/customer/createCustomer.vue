<template>
  <v-row>
    <v-col cols="12">
      <v-form ref="customerForm">
        <v-card>
          <v-card-title>
            {{
            `${isCreateComponent ? "Create Customer" : "Update Customer"}`
            }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-radio-group
                  v-model="title"
                  row
                  :error-messages="titleErrors"
                  @input="$v.title.$touch()"
                >
                  <v-radio label="Mr" value="Mr"></v-radio>
                  <v-radio label="Mrs" value="Mrs"></v-radio>
                  <v-radio label="Miss" value="Miss"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="First Name"
                  outlined
                  v-model="firstName"
                  counter="15"
                  :error-messages="firstNameErrors"
                  @input="$v.firstName.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Last Name"
                  outlined
                  v-model="lastName"
                  counter="15"
                  :error-messages="lastNameErrors"
                  @input="$v.lastName.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Email"
                  outlined
                  v-model="email"
                  :error-messages="emailErrors"
                  @blur="$v.email.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Contact Number"
                  outlined
                  v-model="contactNumber"
                  counter="10"
                  :error-messages="contactNumberErrors"
                  @blur="$v.contactNumber.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field
                  label="Address"
                  outlined
                  v-model="address"
                  :error-messages="addressErrors"
                  @input="$v.address.$touch()"
                ></v-text-field>
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
import { required, maxLength, alpha, email } from "vuelidate/lib/validators";
const phoneNumberValidator = (value) => {
  const regexPattern = /^0(70|71|72|75|76|77|78|11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)\d{7}$/;
  return regexPattern.test(value);
};
export default {
  validations() {
    return {
      title: { required },
      firstName: { required, maxLength: maxLength(15), alpha },
      lastName: { required, maxLength: maxLength(15), alpha },
      email: { email },
      contactNumber: { phoneNumberValidator },
      address: { required },
    };
  },
  computed: {
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      if (!this.$v.title.required) errors.push("Title is required.");
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      if (!this.$v.firstName.required) errors.push("First Name is required.");
      if (!this.$v.firstName.maxLength)
        errors.push("Maximum length for the first name is 15");
      if (!this.$v.firstName.alpha)
        errors.push("First name should be only alphabet characters");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      if (!this.$v.lastName.required) errors.push("Last Name is required.");
      if (!this.$v.lastName.maxLength)
        errors.push("Maximum length for the second name is 15");
      if (!this.$v.lastName.alpha)
        errors.push("Second name should be only alphabet characters");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.email) errors.push("Enter a valid email");
      return errors;
    },
    contactNumberErrors() {
      const errors = [];
      if (!this.$v.contactNumber.$dirty) return errors;
      if (!this.$v.contactNumber.phoneNumberValidator)
        errors.push("Please enter a valid Contact Number.");
      // if (!this.$v.contactNumber.maxLength)
      //   errors.push("Maximum length for the Contact Number is 10");
      // if (!this.$v.contactNumber.numeric)
      //   errors.push("Contact Number should be only numeric characters");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.address.$dirty) return errors;
      if (!this.$v.address.required) errors.push("Address is required.");
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
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      address: "",
      isCreateComponent: true,
      alertType: "error",
      hasAlert: false,
      alert: "",
    };
  },
  methods: {
    async POST() {
      try {
        // console.log("First Name", this.firstName, "Second Name", this.secondName);
        await this.$http.post("/customer", {
          title: this.title,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          contactNumber: this.contactNumber,
          address: this.address,
        });
        this.$refs.customerForm.reset();
        this.$v.$reset();
        this.alertType = "success";
        this.alert = "Customer created successfully!";
        this.hasAlert = true;
      } catch (error) {
        this.alert = "Customer creation fail!";
        this.alertType = "error";
        this.hasAlert = true;
      }
    },
    async GET(id) {
      try {
        const data = await this.$http.get(`/customer/${id}`);
        this.title = data.data.title;
        this.firstName = data.data.firstName;
        this.lastName = data.data.lastName;
        this.email = data.data.email;
        this.contactNumber = data.data.contactNumber;
        this.address = data.data.address;
        console.log(data.data);
      } catch (error) {
        alert("error");
      }
    },
    async PUT() {
      try {
        // console.log("First Name", this.firstName, "Second Name", this.secondName);
        await this.$http.put(`/customer/${this.id}`, {
          title: this.title,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          contactNumber: this.contactNumber,
          address: this.address,
        });
      } catch (error) {
        alert("error");
      }
    },
  },
};
</script>