<template>
  <v-layout row wrap>
    <v-flex>
      <v-card>
        <v-card-title>
          Customer report
        </v-card-title>
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
          <v-btn @click="POST">
            generate
          </v-btn>
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
          text: "Gender [Mr first]",
          value: "title",
        },
        {
          text: "Gender [Ms first]",
          value: "title DESC",
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
        const data = await this.$http.post(
          '/reports/customer',
          formData,
        );

        const { meta } = data.data;

        const body = [
          [
            "Title",
            "First name",
            "Last name",
            "Contact number",
            "Email",
            "Address",
            "Created date",
            "Status",
          ],
        ];
        data.data.data.forEach((element) => {
          const title = {};
          title.text = element.title;
          const first_name = {};
          first_name.text = element.firstName;
          const last_name = {};
          last_name.text = element.lastName;
          const contact_number = {};
          contact_number.text = element.contactNumber;
          const email = {};
          email.text = element.email;
          const skype = {};
          skype.text = element.address;
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
          temp.push(title);
          temp.push(first_name);
          temp.push(last_name);
          temp.push(contact_number);
          temp.push(email);
          temp.push(skype);
          temp.push(created);
          temp.push(status);

          body.push(temp);
        });
        this.generatePDF(body, meta);
      } catch (error) {
        alert("Failed!");
      }
    },
    async generatePDF(body, meta) {
      try {
        const dd = {
          content: [
            {
              text: "Customer report",
              alignment: "center",
              style: "header",
              margin: [0, 20],
            },
            {
              table: {
                widths: [25, 75, 75, 75, "*", 75, 125, 75],
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
        dd.content[0].text = dd.content[0].text.concat(
          ` order by : ${meta.order}`
        );
        if (meta.status == 1) {
          // s = "Active";
          dd.content[0].text = dd.content[0].text.concat(" status : Active");
        }
        if (meta.status == 0) {
          // s = "Inactive";
          dd.content[0].text = dd.content[0].text.concat(" status : Inactive");
        }
        pdfMake.createPdf(dd).download('customer-report.pdf');
      } catch (error) {
        console.log(error)
      }
    },
  },
};
</script>
