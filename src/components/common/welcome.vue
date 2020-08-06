<template>
  <v-row align="center" justify="center">
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title class="primary white--text">Welcome back!</v-card-title>
        <v-card-text>
          <v-text-field
            label="Email"
            outline
            v-model="email"
            :error-messages="emailErrors"
            @blur="$v.email.$touch()"
          ></v-text-field>
          <v-text-field
            type="password"
            label="Password"
            outline
            v-model="password"
            :error-messages="passwordErrors"
            @input="$v.password.$touch()"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary" :disabled="$v.$invalid" @click="onLogin()">login</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
export default {
  validations() {
    return {
      email: { required, email },
      password: { required },
    };
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      if (!this.$v.email.required) errors.push("Email is required.");
      if (!this.$v.email.email) errors.push("Enter a valid email");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      if (!this.$v.password.required) errors.push("Password is required.");
      return errors;
    },
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async onLogin() {
      try {
        await this.$http.post("/auth", {
          email: this.email,
          password: this.password,
        });
        console.log("User created successfully!");
      } catch (error) {
        console.log(error)
        console.log("fxgduccessfully!");
      }
    },
  },
};
</script>