import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import Vuelidate from 'vuelidate';
import Cookies from 'js-cookie';
import moment from 'moment'
Vue.prototype.moment = moment;

Vue.prototype.$http = axios;
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.defaults.headers.common.Authorization = Cookies.get('token');
Vue.config.productionTip = false
Vue.use(Vuelidate);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

