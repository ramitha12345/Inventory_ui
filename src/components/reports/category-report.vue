<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>
        <v-card>
          <v-card-title>
            Category report
          </v-card-title>
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

            <v-checkbox
              label="Filter by time range"
              v-model="is_limit_by_range"
            >
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
                <v-alert type="error" :value="!$v.to.date_greather_than">
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
    </v-layout>
  </v-container>
</template>

<script>
import { required } from "vuelidate/lib/validators";

const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const date_greather_than = (value, vm) => {
  const from = new Date(vm.from);
  const to = new Date(value);
  return from < to;
};

export default {
  computed: {
    min_date() {
      const date = this.moment().format("YYYY-MM-DD");
      return date;
    },
  },
  validations() {
    if (this.is_limit_by_range) {
      return {
        to: { required, date_greather_than },
        from: { required },
        status: { required },
      };
    }
    return {
      status: { required },
    };
  },
  data() {
    return {
      from: "",
      to: "",
      status: "All",
      is_limit_by_range: true,
      titles: [
        {
          text: "Active",
          value: "Active",
        },
        {
          text: "Inactive",
          value: "Inactive",
        },
        {
          text: "All",
          value: "All",
        },
      ],
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

        const data = await this.$http.post("reports/category", formData);
        const body = [
          [
            { text: "Name", style: "title" },
            { text: "Description", style: "title" },
            { text: "Created date", style: "title" },
            { text: "Status", style: "title" },
          ],
        ];
        data.data.data.forEach((element) => {
          const name = {};
          name.text = element.name;

          const description = {};
          description.text = element.description;

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
          temp.push(description);
          temp.push(date);
          temp.push(status);
          body.push(temp);
        });
        if (!data.data.data.length) {
          alert("Sorry no data for your parameters");
        } else {
          this.generatePDF(body, data.data.masterData);
        }
      } catch (error) {
      
        alert("Failed!");
      }
    },
    async generatePDF(body, meta_data) {
      console.log('***',meta_data)
      try {
        const dd = {
          content: [
            {
              text: `Report generated date : ${this.moment().format(
                "YYYY-MM-DD hh:mm A"
              )}`,
              alignment: "right",
            },
            {
              text: "Category report",
              alignment: "center",
              style: "header",
              margin: [0, 20],
            },
            {
              table: {
                widths: [50, "*", 100, 50],
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
        if (meta_data.status == 1) {
          dd.content[1].text = dd.content[1].text.concat(
            " for active categories"
          );
        }
        if (meta_data.status == 0) {
          dd.content[1].text = dd.content[1].text.concat(
            " for inactive categories"
          );
        }
        if (meta_data.is_limit_by_range) {
          dd.content[1].text = dd.content[1].text.concat(
            ` categories created from : ${meta_data.from} to : ${meta_data.to}`
          );
        }
        pdfMake.createPdf(dd).download();
        
      } catch (error) {
         console.log(error)
        
      }
    },
  },
};
</script>
