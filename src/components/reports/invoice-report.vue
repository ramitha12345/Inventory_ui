<template>
  <v-layout row wrap>
    <v-flex>
      <v-card>
        <v-card-title>
          Invoice report
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm12 md12>
              <v-checkbox
                label="All customers"
                v-model="is_all_customers"
              ></v-checkbox>

              <v-select
                v-if="!is_all_customers"
                label="Select a customer"
                :items="customers"
                item-text="text"
                item-value="value"
                v-model="customer_id"
                filled
              ></v-select>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm12 md12>
              <v-checkbox label="All dates" v-model="is_all_dates">
              </v-checkbox>
            </v-flex>

            <v-flex xs12 sm12 md6 v-if="!is_all_dates">
              <v-subheader>
                From
              </v-subheader>
              <v-date-picker v-model="from" :max="min_date" :landscape="true">
              </v-date-picker>
            </v-flex>

            <v-flex xs12 sm12 md6 v-if="!is_all_dates">
              <v-subheader>
                To
              </v-subheader>
              <v-date-picker v-model="to" :max="min_date" :landscape="true">
              </v-date-picker>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-alert type="error" :value="!$v.to.dateGreatherThan">
                The date "to" must be greather than the date "from".
              </v-alert>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="POST" :disabled="$v.$invalid">
            generate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-alert :type="alertType" v-model="isAlert" dismissible>{{
        response
      }}</v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
import { requiredUnless } from "vuelidate/lib/validators";

const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const dateGreatherThan = (value, vm) => {
  const from = new Date(vm.from);
  const to = new Date(value);
  return from < to;
};
export default {
  validations: {
    customer_id: {
      required: requiredUnless((vm) => vm.is_all_customers),
    },
    from: {
      required: requiredUnless((vm) => vm.is_all_dates),
    },
    to: {
      required: requiredUnless((vm) => vm.is_all_dates),
      dateGreatherThan,
    },
  },
  computed: {
    min_date() {
      const d = this.moment().format("YYYY-MM-DD");
      return d;
    },
  },

  mounted() {
    this.GET();
  },
  data() {
    return {
      is_all_customers: false,
      is_all_dates: false,
      from: "",
      to: "",
      customers: [],
      customer_id: "",
      isAlert: false,
      alertType: "success",
      response: "",
    };
  },
  methods: {
    async GET() {
      try {
        const {data} = await this.$http.get("invoice/util-for-report");
       this.customers = data;
      } catch (error) {
        this.response = "Oops! Something went wrong.";
        this.alertType = "error";
        this.isAlert = true;
      }
    },
    async POST() {
      try {
        const formData = {
          is_all_customers: this.is_all_customers,
          is_all_dates: this.is_all_dates,
          from: this.from,
          to: this.to,
          customer_id: this.customer_id,
        };

        const data = await this.$http.post("reports/invoice", formData);

        if (data.data.data2.length == 0) {
          this.response =
            "There is no invoices for the parameter values you passed.";
          this.alertType = "error";
          this.isAlert = true;
        } else {
          const body = [["Invoice number", "Created date", "Customer"]];

          data.data.data2.forEach((element) => {
            const invoice_number = {};
            invoice_number.text = element.id;

            const created = {};
            created.text = this.moment(element.createdAt).format("YYYY-MM-DD");

            const customer = {};
            customer.text = `${element.customer.title}. ${element.customer.firstName} ${element.customer.lastName}`;

            const temp = [];
            temp.push(invoice_number);

            temp.push(created);
            temp.push(customer);

            body.push(temp);
            data.data.data.customer = element.customer.fullName
          });
          this.generatePDF(body, data.data.data);
        }
      } catch (error) {
        this.response = "Oops! Something went wrong.";
        this.alertType = "error";
        this.isAlert = true;
      }
    },
    async generatePDF(body, meta) {
      try {
        const dd = {
          content: [
            {
              text: `Report generated date: ${this.moment().format(
                "YYYY-MM-DD"
              )}`,
              alignment: "right",
            },
            {
              text: "Invoice report",
              alignment: "center",
              style: "header",
              margin: [0, 20],
            },
            {
              table: {
                widths: ["*", "*", "*"],
                body,
              },
            },
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
            },
            bigger: {
              fontSize: 15,
              italics: true,
            },
          },
          defaultStyle: {
            columnGap: 20,
          },
          pageOrientation: "landscape",
        };
        if (!meta.is_all_customers) {
          dd.content[1].text = dd.content[1].text.concat(" ", meta.customer);
        }
        if (!meta.is_all_dates) {
          dd.content[1].text = dd.content[1].text.concat(
            " from ",
            meta.from,
            " to ",
            meta.to
          );
        }
        pdfMake.createPdf(dd).download();
      } catch (error) {
        this.response = "Oops! Something went wrong.";
        this.alertType = "error";
        this.isAlert = true;
      }
    },
  },
};
</script>
