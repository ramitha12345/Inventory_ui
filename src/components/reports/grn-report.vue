<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title>
          GRN report
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm12 md12>
              <v-checkbox
                label="All suppliers"
                v-model="is_all_suppliers"
              ></v-checkbox>

              <v-select
                v-if="!is_all_suppliers"
                label="Select a supplier"
                :items="suppliers"
                item-text="text"
                item-value="value"
                v-model="supplier_id"
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
    supplier_id: {
      required: requiredUnless((vm) => vm.is_all_suppliers),
    },
    from: {
      required: requiredUnless((vm) => vm.is_all_dates),
    },
    to: {
      required: requiredUnless((vm) => vm.is_all_dates),
      dateGreatherThan,
    },
  },
  // validations() {
  //   let dateGreatherThan = (value, vm) => {
  //     let from = new Date(vm.from);
  //     let to = new Date(value);
  //     return from < to;
  //   };
  //   if (!this.is_all_dates) {
  //     return {
  //       from: {
  //         required
  //       },
  //       to: {
  //         required,
  //         dateGreatherThan: this.dateGreatherThan
  //       }
  //     };
  //   }
  // },
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
      is_all_suppliers: false,
      is_all_dates: false,
      from: "",
      to: "",
      suppliers: [],
      supplier_id: "",
      isAlert: false,
      alertType: "success",
      response: "",
      id: null,
    };
  },
  methods: {
    async GET() {
      try {
        const data = await this.$http.get("grn");
        data.data.forEach((element) => {
          const temp = {};
          temp.value = element.customer.id;
          temp.text = `${element.customer.first_name} ${element.customer.last_name}`;

          this.suppliers.push(temp);
        });
      } catch (error) {
        this.response = "Oops! Something went wrong.";
        this.alertType = "error";
        this.isAlert = true;
      }
    },
    async POST() {
      try {
        const date = this.moment(this.to).format("YYYY-MM-DD");
        const formData = {
          is_all_suppliers: this.is_all_suppliers,
          is_all_dates: this.is_all_dates,
          from: this.from,
          to: date,
          supplier_id: this.supplier_id,
        };

        const {data} = await this.$http.post("reports/grn", formData);
        console.log(data)

        if (data.data2.length == 0) {
          this.response =
            "There is no GRNs for the parameter values you passed.";
          this.alertType = "error";
          this.isAlert = true;
        } else {
          const body = [["GRN number", "Created date", "Supplier", "Has a pr"]];

          data.data2.forEach((element) => {
            const grn_no = {};
            grn_no.text = element.id;

            const created = {};
            created.text = this.moment(element.createdAt).format("YYYY-MM-DD");

            const supplier = {};
            supplier.text = `${element.customer.title}. ${element.customer.firstName} ${element.customer.lastName}`;

            const stauts = {};
            element.status ? (stauts.text = "No") : (stauts.text = "Yes");

            const temp = [];
            temp.push(grn_no);
            temp.push(created);
            temp.push(supplier);
            temp.push(stauts);

            body.push(temp);
            // data.data.customer = `${element.customer.title}. ${element.customer.firstName} ${element.customer.lastName}`;
          });
          this.generatePDF(body, data.data);
        }
      } catch (error) {
        console.log(error)
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
              text: "Good received note report",
              alignment: "center",
              style: "header",
              margin: [0, 20],
            },
            {
              table: {
                widths: ["*", "*", "*", "*"],
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
        if (!meta.is_all_suppliers) {
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
