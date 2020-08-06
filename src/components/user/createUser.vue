<template>
  <v-row>
    <v-col cols="12">
      <v-form ref="userForm">
        <v-card>
          <v-card-title>
            {{
            `${isCreateComponent ? "Create User" : "Update User"}`
            }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-col cols="12" md="3">
                <v-text-field
                  label="First Name"
                  outlined
                  v-model="firstName"
                  counter="15"
                  :error-messages="firstNameErrors"
                  @input="$v.firstName.$touch()"
                ></v-text-field>
              </v-col>
              <v-col v-col cols="12" md="3">
                <v-text-field
                  label="Last Name"
                  outlined
                  v-model="lastName"
                  counter="15"
                  :error-messages="lastNameErrors"
                  @input="$v.lastName.$touch()"
                ></v-text-field>
              </v-col>
              <v-col v-col cols="12" md="3">
                <v-radio-group
                  v-model="gender"
                  row
                  :error-messages="genderErrors"
                  @input="$v.gender.$touch()"
                >
                  <v-radio label="Male" value="true"></v-radio>
                  <v-radio label="Female" value="false"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-col cols="12" md="3">
                <v-text-field
                  label="Email"
                  outlined
                  v-model="email"
                  :error-messages="emailErrors"
                  @blur="$v.email.$touch()"
                ></v-text-field>
              </v-col>
              <v-col v-col cols="12" md="3">
                <v-text-field
                  label="NIC"
                  outlined
                  v-model="nic"
                  :error-messages="nicErrors"
                  @blur="$v.nic.$touch()"
                ></v-text-field>
              </v-col>
              <v-col v-col cols="12" md="3">
                <v-text-field
                  label="Role"
                  outlined
                  v-model="role"
                  counter="15"
                  :error-messages="roleErrors"
                  @input="$v.role.$touch()"
                ></v-text-field>
              </v-col>
              <v-col v-col cols="12" md="3">
                <v-text-field
                  type="password"
                  label="Password"
                  outlined
                  v-model="password"
                  :error-messages="passwordErrors"
                  @input="$v.password.$touch()"
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
import {
  required,
  maxLength,
  alpha,
  email,
  alphaNum,
} from "vuelidate/lib/validators";
const nicValidator = (value) => {
  const oldNic = /^[0-9]{9}[vVxX]$/;
  const newNic = /^[0-9]{12}$/;
  return oldNic.test(value) || newNic.test(value);
};
export default {
  validations() {
    return {
      firstName: { required, maxLength: maxLength(15), alpha },
      lastName: { required, maxLength: maxLength(15), alpha },
      gender: { required },
      email: { required, email },
      nic: { nicValidator },
      role: { required, maxLength: maxLength(15), alphaNum },
      password: { required },
    };
  },
  computed: {
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
        errors.push("Maximum length for the last name is 15");
      if (!this.$v.lastName.alpha)
        errors.push("Last name should be only alphabet characters");
      return errors;
    },
    genderErrors() {
      const errors = [];
      if (!this.$v.gender.$dirty) return errors;
      if (!this.$v.gender.required) errors.push("Gender is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      if (!this.$v.email.required) errors.push("Email is required.");
      if (!this.$v.email.email) errors.push("Enter a valid email");
      return errors;
    },
    nicErrors() {
      const errors = [];
      if (!this.$v.nic.$dirty) return errors;
      if (!this.$v.nic.nicValidator) errors.push("Please enter valid NIC.");
      // if (!this.$v.nic.between) errors.push("NIC length should be 10 or 12");
      // if (!this.$v.nic.alphaNum)
      //   errors.push("NIC should be only alpha numeric characters");
      return errors;
    },
    roleErrors() {
      const errors = [];
      if (!this.$v.role.$dirty) return errors;
      if (!this.$v.role.required) errors.push("Role is required.");
      if (!this.$v.role.maxLength)
        errors.push("Maximum length for the Role is 15");
      if (!this.$v.role.alphaNum)
        errors.push("Role should alpha numeric characters");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required) errors.push("Password is required.");
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
      firstName: "",
      lastName: "",
      gender: true,
      email: "",
      nic: "",
      role: "",
      password: "",
      isCreateComponent: true,
      alertType: "error",
      hasAlert: false,
      alert: "",
    };
  },
  methods: {
    async POST() {
      try {
        await this.$http.post("/user", {
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          email: this.email,
          nic: this.nic,
          role: this.role,
          password: this.password,
        });
        this.$refs.userForm.reset();
        this.$v.$reset();
        this.alertType = "success";
        this.alert = "User created successfully!";
        this.hasAlert = true;
      } catch (error) {
        if (error.response.status === 422) {
          this.alert = "NIC already exist";
        } else {
          this.alert = "User creation fail!";
        }
        this.alertType = "error";
        this.hasAlert = true;
      }
    },
    async GET(id) {
      try {
        const data = await this.$http.get(`/user/${id}`);
        this.firstName = data.data.firstName;
        this.lastName = data.data.lastName;
        this.gender = data.data.gender;
        this.email = data.data.email;
        this.nic = data.data.nic;
        this.role = data.data.role;
        this.password = data.data.password;
        console.log(data.data);
      } catch (error) {
        alert("error");
      }
    },
    async PUT() {
      try {
        await this.$http.post(`/user/${this.id}`, {
          firstName: this.firstName,
          lastName: this.lastName,
          gender: this.gender,
          email: this.email,
          nic: this.nic,
          role: this.role,
          password: this.password,
        });
      } catch (error) {
        alert("error");
      }
    },
  },
};
</script>