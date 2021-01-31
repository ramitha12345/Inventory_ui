<template>
  <v-layout row wrap>
    <v-flex>
      <v-card>
        <v-card-title>
          Stock report
        </v-card-title>
        <v-card-text>
          <v-text-field label="Search" v-model="search" filled></v-text-field>

          <v-data-table :items="items" :headers="headers" :search="search">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.qty }}</td>
              <td>{{ props.item.category }}</td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="generatePdf">
            get pdf
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
  mounted() {
    this.GET();
  },
  data() {
    return {
      headers: [
        {
          text: "Product",
          value: "name",
        },
        {
          text: "Available qty",
          value: "qty",
        },
        {
          text: "Category",
          value: "category",
        },
        // {
        //   text: 'Subcategory',
        //   value: 'item.subcategory.name',
        // },
      ],
      items: [],
      search: "",
    };
  },
  methods: {
    async GET() {
      try {
        const data = await this.$http.get("reports/stock");
        this.items = data.data;
      } catch (error) {
        // eslint-disable-next-line
      }
    },
    async generatePdf() {
      const body = [["Product", "Available qty", "Category"]];
      this.items.forEach((element) => {
        const temp = [];
        const product = {};
        product.text = element.name;
        const qty = {};
        qty.text = `${element.qty}`;
        const category = {};
        category.text = element.category;

        temp.push(product);
        temp.push(qty);
        temp.push(category);

        body.push(temp);
      });

      const dd = {
        content: [
          {
            text: `STOCK STATEMENT`,
            alignment: "center",
            style: "header",
            margin: [0, 20],
          },
          {
            table: {
              widths: ["*", 75, 75, 75],
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
      };
      pdfMake.createPdf(dd).download();
    },
  },
};
</script>
