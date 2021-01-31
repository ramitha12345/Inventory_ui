<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title> Purchase return report </v-card-title>
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
              <v-subheader> From </v-subheader>
              <v-date-picker v-model="from" :max="min_date" :landscape="true">
              </v-date-picker>
            </v-flex>

            <v-flex xs12 sm12 md6 v-if="!is_all_dates">
              <v-subheader> To </v-subheader>
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
          <v-btn @click="POST" :disabled="$v.$invalid"> generate </v-btn>
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
    };
  },
  methods: {
    async GET() {
      try {
        const { data } = await this.$http.get("pr/util");
        data.forEach((element) => {
          const temp = {};
          temp.value = element.grn_master.customer.id;
          temp.text = element.grn_master.customer.fullName;

          this.suppliers.push(temp);
        });
      } catch (error) {
        console.log(error);

        this.response = "Oops! Something went wrong.";
        this.alertType = "error";
        this.isAlert = true;
      }
    },
    async POST() {
      try {
        const formData = {
          is_all_suppliers: this.is_all_suppliers,
          is_all_dates: this.is_all_dates,
          from: this.from,
          to: this.to,
          supplier_id: this.supplier_id,
        };

        const { data } = await this.$http.post("reports/pr", formData);

        console.log(data.data2.length)

        if (data.data2.length === 0) {
          this.response =
            "There is no Sales returns for the parameter values you passed.";
          this.alertType = "error";
          this.isAlert = true;
        } else {
          
          const body = [
            ["GRN number", "PR number", "Created date", "Supplier"],
          ];

          data.data2.forEach((element) => {
            const grn_no = {};
            grn_no.text = element.grn_master.id;

            const created = {};
            created.text = this.moment(element.createdAt).format("YYYY-MM-DD");

            const supplier = {};
            supplier.text = element.grn_master.customer.fullName;

            const pr_no = {};
            pr_no.text = element.id;

            const temp = [];
            temp.push(grn_no);
            temp.push(pr_no);
            temp.push(created);
            temp.push(supplier);

            body.push(temp);
            data.data.customer = element.grn_master.customer.fullName;
          });
          this.generatePDF(body, data.data);
        }
      } catch (error) {
        console.log(error)
        this.response =
          "There is no Sales returns for the parameter values you passed.";
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
              text: "Purchase return report",
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
        console.log(error)
        this.response =
          "There is no Sales returns for the parameter values you passed.";
        this.alertType = "error";
        this.isAlert = true;
      }
    },
  },
};
</script>
