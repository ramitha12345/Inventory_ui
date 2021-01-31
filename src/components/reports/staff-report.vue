<template>
  <v-layout row wrap>
    <v-flex>
      <v-card>
        <v-card-title> User report </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm12 md6>
              <v-select
                label="Order by"
                v-model="order_by"
                :items="order_by_items"
                filled
              >
              </v-select>
            </v-flex>

            <v-flex xs12 sm12 md6>
              <v-select
                label="Status"
                v-model="status"
                item-text="text"
                item-value="value"
                filled
                :items="customerStatus"
              >
              </v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="POST"> generate </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
  data() {
    return {
      order_by: "firstName",
      status: 1,
      customerStatus: [
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
      order_by_items: [
        {
          text: "First name [ascending]",
          value: "firstName",
        },
        {
          text: "First name [descending]",
          value: "firstName DESC",
        },
        {
          text: "Last name [ascending]",
          value: "lastName",
        },
        {
          text: "Last name [descending]",
          value: "lastName DESC",
        },
        {
          text: "Role [ascending]",
          value: "role",
        },
        {
          text: "Role [descending]",
          value: "role",
        },
        {
          text: "Created date [ascending]",
          value: "createdAt",
        },
        {
          text: "Created date [descending]",
          value: "createdAt DESC",
        },
      ],
    };
  },
  methods: {
    async POST() {
      try {
        const formData = {
          type: "customer",
          status: this.status,
          order: this.order_by,
        };

        // eslint-disable-next-line
        const data = await this.$http.post(`/reports/user`, formData);

        const { meta } = data.data;

        const body = [
          [
            "Role",
            "First name",
            "Last name",
            "Email",
            "Status",
            "Created date",
          ],
        ];
        data.data.data.forEach((element) => {
          const role = {};
          role.text = element.role;
          const first_name = {};
          first_name.text = element.firstName;
          const last_name = {};
          last_name.text = element.lastName;
          // const contact_number = {};
          // contact_number.text = element.contact_number;

          const email = {};
          email.text = element.email;

          const created = {};
          created.text = this.moment(element.createdAt).format(
            "YYYY-MM-DD hh:mm A"
          );
          const status = {};
          if (element.status) {
            status.text = "Active";
          } else {
            status.text = "Inactive";
          }
          const temp = [];
          temp.push(role);
          temp.push(first_name);
          temp.push(last_name);

          temp.push(email);
          temp.push(status);
          temp.push(created);

          body.push(temp);
        });
        this.generatePDF(body, meta);
      } catch (error) {
        console.log(error);
        alert("Failed!");
      }
    },
    async generatePDF(body, meta) {
      try {
        const dd = {
          content: [
            {
              text: `Report generated date : ${this.moment().format(
                "YYYY-MM-DD"
              )}`,
              alignment: "right",
            },
            {
              text: "Staff report",
              alignment: "center",
              style: "header",
              margin: [0, 20],
            },
            {
              table: {
                widths: [50, 75, 75, "*", 75, 125],
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
        dd.content[1].text = dd.content[1].text.concat(
          ` order by : ${meta.order}`
        );
        if (meta.status == 1) {
          // s = "Active";
          dd.content[1].text = dd.content[1].text.concat(" status : Active");
        }
        if (meta.status == 0) {
          // s = "Inactive";
          dd.content[1].text = dd.content[1].text.concat(" status : Inactive");
        }
        pdfMake.createPdf(dd).download();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
