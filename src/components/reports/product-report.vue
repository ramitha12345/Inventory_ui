<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-title> Product report </v-card-title>
        <v-card-text>
          <v-select
            label="Select the status"
            :items="titles"
            item-text="text"
            item-value="value"
            v-model="status"
            filled
          >
          </v-select>

          <v-checkbox label="Filter by time range" v-model="is_limit_by_range">
          </v-checkbox>

          <v-layout row wrap v-if="is_limit_by_range">
            <v-flex xs12 sm12 md6>
              <div class="title">From</div>
              <v-date-picker :landscape="true" :max="min_date" v-model="from">
              </v-date-picker>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <div class="title">To</div>
              <v-date-picker :landscape="true" :max="min_date" v-model="to">
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
          <v-btn @click="POST" color="orange" :disabled="$v.$invalid">
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
import { required } from "vuelidate/lib/validators";

const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const dateGreatherThan = (value, vm) => {
  const from = new Date(vm.from);
  const to = new Date(value);
  return from < to;
};

export default {
  validations() {
    if (this.is_limit_by_range) {
      return {
        to: { required, dateGreatherThan },
        from: { required },
        status: { required },
      };
    }
    return {
      status: { required },
    };
  },
  computed: {
    min_date() {
      const date = this.moment().format("YYYY-MM-DD");
      return date;
    },
  },
  data() {
    return {
      from: "",
      to: "",
      status: 9,
      is_limit_by_range: true,
      titles: [
        {
          text: "Active",
          value: 1,
        },
        {
          text: "Inactive",
          value: 0,
        },
        {
          text: "All",
          value: 9,
        },
      ],
      isAlert: false,
      alertType: "success",
      response: "",
    };
  },
  methods: {
    async POST() {
      try {
        const formData = {
          from: this.from,
          to: this.to,
          is_limit_by_range: this.is_limit_by_range,
          status: this.status,
        };

        const data = await this.$http.post("reports/product", formData);
        const body = [
          [
            { text: "Name", style: "title" },
            { text: "Is imported", style: "title" },
            { text: "Selling price", style: "title" },
            { text: "Qty", style: "title" },

            { text: "Reorder level", style: "title" },
            { text: "Size", style: "title" },
            { text: "Created date", style: "title" },
            { text: "Status", style: "title" },
          ],
        ];
        data.data.data.forEach((element) => {
          const name = {};
          name.text = element.name;

          const isImported = {};
          isImported.text = element.isImported;

          const price = {};
          price.text = element.price;

          const qty = {};
          qty.text = element.qty;

          const reorderLevel = {};
          reorderLevel.text = element.reorderLevel;

          const size = {};
          size.text = element.size;

          const date = {};
          const created = this.moment(element.createdAt).format(
            "YYYY-MM-DD hh:mm A"
          );
          date.text = created;
          const status = {};
          if (element.status) {
            status.text = "Active";
          } else {
            status.text = "Inactive";
          }

          const temp = [];
          temp.push(name);
          temp.push(isImported);
          temp.push(price);
          temp.push(qty);

          temp.push(reorderLevel);
          temp.push(size);
          temp.push(date);
          temp.push(status);
          body.push(temp);
        });
        if (!data.data.data.length) {
          this.response = "Sorry no data for seleted parameters.";
          this.alertType = "error";
          this.isAlert = true;
        } else {
          this.generatePDF(body, data.data.masterData);
        }
      } catch (error) {
        this.response = "Oops! Something went wrong.";
        this.alertType = "error";
        this.isAlert = true;
      }
    },

    async generatePDF(body, masterData) {
      console.log('body',body)
      const dd = {
        content: [
          {
            text: `Report generated date : ${this.moment().format(
              "YYYY-MM-DD hh:mm A"
            )}`,
            alignment: "right",
          },
          {
            text: "Product report",
            alignment: "center",
            style: "header",
            margin: [0, 20],
          },
          {
            table: {
              widths: [50, 50, 50, 50, 50, 50, 50, 50],
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
          title: {
            bold: true,
          },
        },
        defaultStyle: {
          columnGap: 20,
        },
      };
      if (masterData.status == 1) {
        dd.content[1].text = dd.content[1].text.concat(" for active products");
      }
      if (masterData.status == 0) {
        dd.content[1].text = dd.content[1].text.concat(
          " for inactive products"
        );
      }
      if (masterData.is_limit_by_range) {
        dd.content[1].text = dd.content[1].text.concat(
          ` products created from : ${masterData.from} to : ${masterData.to}`
        );
      }
      pdfMake.createPdf(dd).download();
    },
  },
};
</script>
